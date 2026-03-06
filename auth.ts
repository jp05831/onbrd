import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import database from './app/lib/db'

const providers = []

// Only add Google if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

// Always add credentials provider
providers.push(
  Credentials({
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    authorize: async (credentials) => {
      console.log('[authorize] Attempting login for:', credentials?.email)
      
      if (!credentials?.email || !credentials?.password) {
        console.log('[authorize] Missing credentials')
        return null
      }

      try {
        const user = await database.getUserByEmail(credentials.email as string)
        console.log('[authorize] Found user:', user?.id, user?.email)
        
        if (!user || !user.password_hash) {
          console.log('[authorize] No user or no password hash')
          return null
        }

        const valid = database.verifyPassword(credentials.password as string, user.password_hash)
        console.log('[authorize] Password valid:', valid)
        
        if (!valid) return null

        const result = {
          id: user.id,
          email: user.email,
          name: user.name,
        }
        console.log('[authorize] Returning user:', result)
        return result
      } catch (error) {
        console.error('[authorize] Error:', error)
        return null
      }
    },
  })
)

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          let dbUser = await database.getUserByEmail(user.email!)
          
          if (!dbUser) {
            const id = await database.createUserFromOAuth(
              user.email!,
              user.name || 'User',
              'google',
              account.providerAccountId
            )
            dbUser = await database.getUserById(id)
          }
        } catch (error) {
          console.error('Google sign in error:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user }) {
      console.log('[jwt] Called with user:', user?.email, 'existing token userId:', token.userId)
      if (user) {
        try {
          const dbUser = await database.getUserByEmail(user.email!)
          console.log('[jwt] Database lookup result:', dbUser?.id)
          if (dbUser) {
            token.userId = dbUser.id
            token.plan = dbUser.plan
          }
        } catch (error) {
          console.error('[jwt] Error:', error)
        }
      }
      console.log('[jwt] Returning token with userId:', token.userId)
      return token
    },
    async session({ session, token }) {
      console.log('[session] Called with token userId:', token.userId)
      if (token.userId) {
        session.user.id = token.userId as string
        ;(session.user as any).plan = token.plan
      }
      console.log('[session] Returning session user id:', session.user?.id)
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
})
