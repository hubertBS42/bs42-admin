'use client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

import { Loader } from 'rsuite'

const CheckAuthenticated = ({ children }) => {
	const { status } = useSession({
		required: true,
		onUnauthenticated() {
			redirect('/signin')
		},
	})

	if (status === 'loading')
		return <Loader inverse center content='loading...' />
	return children
}
export default CheckAuthenticated
