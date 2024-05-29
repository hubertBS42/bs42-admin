import OrderForm from '@/components/OrderForm/OrderForm'
import { fetcher } from '@/utils/functions'
import { notFound } from 'next/navigation'

const page = async ({ params }) => {
	const { status, data } = await fetcher(
		`https://portal.bs42.net/api/orders/${params.number}`,
		{ cache: 'no-store' }
	)

	if (status === 'error') return notFound()
	return (
		<>
			<OrderForm order={data} />
		</>
	)
}
export default page
