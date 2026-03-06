import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import database from './app/lib/db'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = database.getUserByEmail(credentials.email as string)
        if (!user) return null

        const valid = database.verifyPassword(credentials.password as string, user.password_hash)
        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        // Check if user exists
        let dbUser = database.getUserByEmail(user.email!)
        
        if (!dbUser) {
          // Create new user from Google
          const id = database.createUserFromOAuth(
            user.email!,
            user.name || 'User',
            'google',
            account.providerAccountId
          )
          dbUser = database.getUserById(id)
        } else if (!dbUser.oauth_provider) {
          // Link existing email account to Google
          database.updateUser(dbUser.id, {
            oauth_provider: 'google',
            oauth_id: account.providerAccountId,
          } as any)
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        const dbUser = database.getUserByEmail(user.email!)
        if (dbUser) {
          token.userId = dbUser.id
          token.plan = dbUser.plan
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
})
