'use client'

import { SessionProvider } from 'next-auth/react'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import ReduxProvider from './ReduxProvider'
import { CustomProvider } from 'rsuite'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

const AllProviders = ({ children }) => {
	return (
		<>
			<ToastContainer hideProgressBar />
			<ProgressBar
				color='#34C3FF'
				options={{ showSpinner: false }}
				shallowRouting
			/>
			<SessionProvider>
				<ReduxProvider>
					<CustomProvider theme='dark'>{children}</CustomProvider>
				</ReduxProvider>
			</SessionProvider>
		</>
	)
}
export default AllProviders
