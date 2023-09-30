'use client'
import SettingsForm from '@/components/SettingsForm/SettingsForm'
import { fetcher } from '@/utils/functions'
import { useEffect, useState } from 'react'

const SettingsPage = () => {
	const [data, setData] = useState(null)

	useEffect(() => {
		const loadData = async () => {
			const { data } = await fetcher('/api/settingsAndCurrencies')
			setData(data)
		}

		loadData()
	}, [])

	return <>{data && <SettingsForm data={data} />}</>
}
export default SettingsPage
