'use client'
import 'rsuite/dist/rsuite.min.css'
import './globals.scss'
import { generatePageTitle } from '@/utils/functions'
import { poppins } from '@/utils/font'
import AllProviders from '@/components/providers/AllProviders'

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
