'use client'

import MessagesTable from '@/components/MessagesTable/MessagesTable'
import styles from './page.module.scss'
import { loadMessages } from '@/redux/features/messages/messagesActions'
import { useEffect } from 'react'
import MessagesDrawer from '@/components/MessagesDrawer/MessagesDrawer'

const MessagesPage = () => {
	useEffect(() => {
		loadMessages()
	}, [])

	return (
		<div className={styles.mainWrapper}>
			<MessagesTable />
			<MessagesDrawer />
		</div>
	)
}
export default MessagesPage
