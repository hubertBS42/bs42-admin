'use client'
import CurrenciesDrawer from '@/components/CurrenciesDrawer/CurrenciesDrawer'
import CurrenciesTable from '@/components/CurrenciesTable/CurrenciesTable'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import {
	deleteCurrency,
	loadCurrencies,
} from '@/redux/features/currencies/currenciesActions'
import { useEffect } from 'react'

const CurrencyPage = () => {
	const handleDelete = async data => {
		await deleteCurrency(data)
	}

	useEffect(() => {
		loadCurrencies()
	}, [])
	return (
		<div>
			<CurrenciesTable />
			<CurrenciesDrawer />
			<DeleteModal handleDelete={handleDelete} />
		</div>
	)
}
export default CurrencyPage
