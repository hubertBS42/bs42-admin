'use client'
import SettingsForm from '@/components/SettingsForm/SettingsForm'
import { fetcher } from '@/utils/functions'
import useSWR from 'swr'

const SettingsPage = () => {
	const { data, error } = useSWR('/api/settingsAndCurrencies', fetcher)
	console.log(data)

	return <>{data && <SettingsForm data={data} />}</>
}
export default SettingsPage
