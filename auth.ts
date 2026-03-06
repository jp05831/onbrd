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
      if (!credentials?.email || !credentials?.password) {
        return null
      }

      try {
        const user = await database.getUserByEmail(credentials.email as string)
        if (!user || !user.password_hash) return null

        const valid = database.verifyPassword(credentials.password as string, user.password_hash)
        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      } catch (error) {
        console.error('Auth error:', error)
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
      if (user) {
        try {
          const dbUser = await database.getUserByEmail(user.email!)
          if (dbUser) {
            token.userId = dbUser.id
            token.plan = dbUser.plan
          }
        } catch (error) {
          console.error('JWT error:', error)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId as string
        ;(session.user as any).plan = token.plan
      }
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
