import SettingsForm from '@/components/SettingsForm/SettingsForm'
import { fetcher } from '@/utils/functions'

const loadData = async () => {
	const { data } = await fetcher(
		`${process.env.NEXT_PUBLIC_HOST}/api/settingsAndCurrencies`,
		{ cache: 'no-store' }
	)
	return data
}

const SettingsPage = async () => {
	const data = await loadData()
	return <SettingsForm data={data} />
}
export default SettingsPage
