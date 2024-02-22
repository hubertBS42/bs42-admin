'use client'
import CurrenciesDrawer from '@/components/CurrenciesDrawer/CurrenciesDrawer'
import CurrenciesForm from '@/components/CurrenciesForm/CurrenciesForm'
import CurrenciesTable from '@/components/CurrenciesTable/CurrenciesTable'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import {
	deleteCurrency,
	loadCurrencies,
} from '@/redux/features/currencies/currenciesActions'
import { useEffect } from 'react'
import { Col, Grid, Row } from 'rsuite'

const CurrencyPage = () => {
	const handleDelete = async data => {
		await deleteCurrency(data)
	}

	useEffect(() => {
		loadCurrencies()
	}, [])
	return (
		<Grid fluid>
			<Row>
				<Col xs={24}>
					<CurrenciesTable />
					<CurrenciesDrawer />
					<DeleteModal handleDelete={handleDelete} />
				</Col>
			</Row>
		</Grid>
	)
}
export default CurrencyPage
