import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { connectToDB } from '@/utils/database'
import User from '@/models/User'
import Role from '@/models/Role'
import Resource from '@/models/Resource'

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			id: 'credentials',
			name: 'Credentials',
			async authorize(credentials, req) {
				try {
					await connectToDB()
					const user = await User.findOne({
						email: credentials.email,
					})
						.populate({
							path: 'role',
							model: 'Role',
							select: '_id',
							populate: {
								path: 'permissions.resource',
								model: 'Resource',
								select: '_id',
							},
						})
						.select('firstName lastName email password role')
						.lean()

					if (!user) throw new Error('Incorrect login details')

					const isPasswordCorrect = await compare(
						credentials.password,
						user.password
					)

					if (!isPasswordCorrect || user.email !== credentials.email)
						throw new Error('Incorrect login details.')

					return user
				} catch (error) {
					throw new Error(error)
				}
			},
		}),
	],
	session: {
		// Choose how you want to save the user session.
		// The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
		// If you use an `adapter` however, we default it to `"database"` instead.
		// You can still force a JWT session by explicitly defining `"jwt"`.
		// When using `"database"`, the session cookie will only contain a `sessionToken` value,
		// which is used to look up the session in the database.
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
					role: user?.role,
					firstName: user?.firstName,
					lastName: user?.lastName,
				}
			return token
		},
		async session({ session, token, user }) {
			// Send properties to the client, like an access_token and user id from a provider.
			session.accessToken = token.accessToken
			session.user.role = token.role
			session.user.firstName = token.firstName
			session.user.lastName = token.lastName

			return session
		},
	},
	secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
