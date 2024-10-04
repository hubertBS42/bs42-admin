'use client'

import styles from './page.module.scss'

import { useEffect } from 'react'
import QuotationsTable from '@/components/QuotationsTable/QuotationsTable'
import { loadQuotations } from '@/redux/features/quotations/quotationsActions'

const QuotationsPage = () => {
	useEffect(() => {
		loadQuotations()
	}, [])
	return (
		<div className={styles.mainWrapper}>
			<QuotationsTable />
		</div>
	)
}
export default QuotationsPage
