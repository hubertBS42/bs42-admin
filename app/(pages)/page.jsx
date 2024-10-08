import Stats from '@/components/Stats/Stats'
import { fetcher } from '@/utils/functions'

const Dashboard = async () => {
	const { status, data } = await fetcher(
		'http://localhost:3000/api/stats/all',
		{ cache: 'no-store' }
	)

	return <Stats data={data} />
}
export default Dashboard
