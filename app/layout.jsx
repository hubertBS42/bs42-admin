'use client'
import 'rsuite/dist/rsuite.min.css'
import './globals.scss'
import { generatePageTitle } from '@/utils/functions'
import AllProviders from '@/components/Providers/AllProviders'
import { poppins } from '@/utils/font'

export default function RootLayout({ children }) {
	const pageTitle = generatePageTitle()
	return (
		<html lang='en'>
			<head>
				<title>{`${pageTitle} - BS42.net Admin Portal`}</title>
			</head>
			<body
				className={poppins.className}
				suppressHydrationWarning={true}
			>
				<AllProviders>{children}</AllProviders>
			</body>
		</html>
	)
}
