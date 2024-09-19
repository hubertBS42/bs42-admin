'use client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { usePathname } from 'next/navigation'

import { Loader } from 'rsuite'

const CheckAuthenticated = ({ children }) => {
	let pathname = usePathname()

	const { status } = useSession({
		required: true,
		onUnauthenticated() {
			redirect(`/signin?redirect_to=${encodeURIComponent(pathname)}`)
		},
	})

	if (status === 'loading')
		return <Loader inverse center content='loading...' />
	return children
}
export default CheckAuthenticated
