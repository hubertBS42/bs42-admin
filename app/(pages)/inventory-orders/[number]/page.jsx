import InventoryOrderForm from '@/components/InventoryOrderForm/InventoryOrderForm'
import { fetcher } from '@/utils/functions'
import { notFound } from 'next/navigation'

const InventoryOrdersPage = async ({ params }) => {
	const { status, data } = await fetcher(
		`http://localhost:3000/api/inventory-orders/${params.number}`,
		{ cache: 'no-store' }
	)

	if (status === 'error') return notFound()
	return <InventoryOrderForm order={data} />
}
export default InventoryOrdersPage
