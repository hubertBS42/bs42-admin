'use client'

import { Nav, Navbar } from 'rsuite'

import GearIcon from '@rsuite/icons/Gear'
import ExitIcon from '@rsuite/icons/Exit'
import NoticeIcon from '@rsuite/icons/Notice'
import { signOut, useSession } from 'next-auth/react'

import styles from './TopNav.module.scss'
import { generatePageTitle } from '@/utils/functions'

const TopNav = () => {
	const pageTitle = generatePageTitle()

	const { data: session, status } = useSession()

	return (
		<Navbar>
			<Navbar.Brand className={styles.pageTitle}>
				{pageTitle}
			</Navbar.Brand>
			<Nav pullRight>
				{/* <Nav.Item icon={<GearIcon />}>Settings</Nav.Item> */}
				{/* <Nav.Item icon={<NoticeIcon />}>Notifications</Nav.Item> */}
				{/* <Button onClick={signOut}>Sign out</Button> */}
				{/* <Avatar circle className={styles.avatar}>
											HQ
										</Avatar> */}

				{status === 'authenticated' && (
					<Nav.Menu
						title={`${session?.user.firstName} ${session?.user.lastName}`}
						placement='bottomEnd'
					>
						<Nav.Item icon={<GearIcon />}>Settings</Nav.Item>
						<Nav.Item icon={<NoticeIcon />}>Notifications</Nav.Item>
						<Nav.Item icon={<ExitIcon />} onClick={signOut}>
							Logout
						</Nav.Item>
					</Nav.Menu>
				)}
			</Nav>
		</Navbar>
	)
}
export default TopNav
