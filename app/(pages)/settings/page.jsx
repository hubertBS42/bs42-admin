'use client'
import SettingsForm from '@/components/SettingsForm/SettingsForm'
import { fetcher } from '@/utils/functions'
import { use } from 'react'

const loadData = async () => {
	const { data } = await fetcher(
		`${process.env.NEXT_PUBLIC_HOST}/api/settingsAndCurrencies`,
		{ cache: 'no-store' }
	)
	return data
}

const SettingsPage = () => {
	const data = use(loadData())
	return <>{data && <SettingsForm data={data} />}</>
}
export default SettingsPage
