'use client'
import RateForm from '@/components/RateForm/RateForm'
import styles from './page.module.scss'
import { loadRates } from '@/redux/features/rates/ratesActions'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getRates } from '@/redux/features/rates/ratesSlice'

const RateSettingsPage = () => {
	useEffect(() => {
		loadRates()
	}, [])

	const rates = useSelector(getRates)
	return (
		<div className={styles.mainWrapper}>
			<RateForm rates={rates} />
		</div>
	)
}
export default RateSettingsPage
