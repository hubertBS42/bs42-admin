import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDB } from '@/utils/database'
import User from '@/models/User'

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			id: 'credentials',
			name: 'Credentials',
			async authorize(credentials, req) {
				try {
					await connectToDB()
					const user = await User.authUser(
						credentials.email,
						credentials.password
					)

					return user
				} catch (error) {
					throw new Error(error)
				}
			},
		}),
	],
	session: {
		strategy: 'jwt',

		// Seconds - How long until an idle session expires and is no longer valid.
		maxAge: 60 * 60, // 1 hour

		// Seconds - Throttle how frequently to write to database to extend a session.
		// Use it to limit write operations. Set to 0 to always update the database.
		// Note: This option is ignored if using JSON Web Tokens
		updateAge: 24 * 60 * 60, // 24 hours

		// The session token is usually either a random UUID or string, however if you
		// need a more customized session token string, you can define your own generate function.
		generateSessionToken: () => {
			return randomUUID?.() ?? randomBytes(32).toString('hex')
		},
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user)
				return {
					...token,
					role: user?.role?.title,
					firstName: user?.firstName,
					id: user?._id,
					lastName: user?.lastName,
					profileImg: user?.profileImg?.url || null,
				}
			return token
		},
		async session({ session, token, user }) {
			// Send properties to the client, like an access_token and user id from a provider.
			session.accessToken = token.accessToken
			session.user.role = token.role
			session.user.id = token.id
			session.user.firstName = token.firstName
			session.user.lastName = token.lastName

			return session
		},
	},
	secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
