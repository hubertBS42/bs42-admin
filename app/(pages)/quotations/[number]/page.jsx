import QuotationForm from '@/components/QuotationForm/QuotationForm'
import { fetcher } from '@/utils/functions'
import { notFound } from 'next/navigation'

const page = async ({ params }) => {
	const { status, data } = await fetcher(
		`https://portal.bs42.net/api/quotations/${params.number}`,
		{ cache: 'no-store' }
	)

	if (status === 'error') return notFound()
	return <QuotationForm quotation={data} />
}
export default page
