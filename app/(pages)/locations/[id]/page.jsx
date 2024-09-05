import LocationForm from '@/components/LocationForm/LocationForm'
import StorageDrawer from '@/components/StorageDrawer/StorageDrawer'
import { fetcher } from '@/utils/functions'
import { notFound } from 'next/navigation'

const EditLocationPage = async ({ params }) => {
	const { status, data } = await fetcher(
		`https://portal.bs42.net/api/locations/${params.id}`,
		{ cache: 'no-store' }
	)

	if (status === 'error') return notFound()
	return (
		<>
			<LocationForm location={data} />
			<StorageDrawer id={params.id} />
		</>
	)
}
export default EditLocationPage
