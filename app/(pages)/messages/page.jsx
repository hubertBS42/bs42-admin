'use client'

import MessagesTable from '@/components/MessagesTable/MessagesTable'
import styles from './page.module.scss'
import { loadMessages } from '@/redux/features/messages/messagesActions'
import { useEffect } from 'react'
import MessagesDrawer from '@/components/MessagesDrawer/MessagesDrawer'
import { loadAllUsers } from '@/redux/features/users/usersActions'

const MessagesPage = () => {
	useEffect(() => {
		loadMessages()
		loadAllUsers()
	}, [])

	return (
		<div className={styles.mainWrapper}>
			<MessagesTable />
			<MessagesDrawer />
		</div>
	)
}
export default MessagesPage
