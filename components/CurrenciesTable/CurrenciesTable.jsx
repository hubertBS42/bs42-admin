'use client'

import {
	Button,
	IconButton,
	Modal,
	Pagination,
	Panel,
	Stack,
	Table,
} from 'rsuite'
import TableSearch from '../TableSearch/TableSearch'

import TrashIcon from '@rsuite/icons/Trash'
import EditIcon from '@rsuite/icons/Edit'
import PlusIcon from '@rsuite/icons/Plus'
import HistoryIcon from '@rsuite/icons/History'

import { useState } from 'react'
import { formatDate } from '@/utils/functions'
import { useDispatch, useSelector } from 'react-redux'
import {
	getCurrenciesCount,
	getCurrenciesLoadingState,
	getCurrencies,
} from '@/redux/features/currencies/currenciesSlice'
import { setModalOpen } from '@/redux/features/modal/modalSlice'
import { setDrawerOpen } from '@/redux/features/drawer/drawerSlice'
import Status from '../Status/Status'
import {
	limitCurrencies,
	paginateCurrencies,
	searchCurrencies,
	sortCurrencies,
} from '@/redux/features/currencies/currenciesActions'
import CurrencyRateHistory from '../CurrencyRateHistory/CurrencyRateHistory'

const { Column, HeaderCell, Cell } = Table

const CurrenciesTable = () => {
	const dispatch = useDispatch()
	const [open, setOpen] = useState(false)
	const [currency, setCurrency] = useState([])
	const [sortType, setSortType] = useState('desc')
	const [sortColumn, setSortColumn] = useState('updatedAt')
	const [limit, setLimit] = useState(10)
	const [page, setPage] = useState(1)

	const currencies = useSelector(getCurrencies)
	const count = useSelector(getCurrenciesCount)
	const loading = useSelector(getCurrenciesLoadingState)

	const handleOpen = data => {
		setCurrency(data)
		setOpen(true)
	}
	const handleClose = () => setOpen(false)

	const handleSortColumn = async (sortColumn, sortType) => {
		sortCurrencies(limit, page, sortColumn, sortType)
		setSortColumn(sortColumn)
		setSortType(sortType)
	}

	const handleChangeLimit = async dataKey => {
		setPage(1)
		setLimit(dataKey)
		limitCurrencies(dataKey)
	}

	const handlePageChange = async value => {
		setPage(value)
		paginateCurrencies(limit, value, sortColumn, sortType)
	}

	let typingTimer
	const handleSearch = async query => {
		clearTimeout(typingTimer)

		typingTimer = setTimeout(() => {
			searchCurrencies(query, limit, page)
		}, 1000)
	}

	return (
		<div>
			<Panel
				header={
					<Stack justifyContent='space-between'>
						<span>Currency List</span>
						<Stack spacing={10}>
							<TableSearch handleSearch={handleSearch} />
							<IconButton
								icon={<PlusIcon />}
								circle
								size='sm'
								appearance='primary'
								onClick={() => dispatch(setDrawerOpen({ mode: 'add' }))}
							/>
						</Stack>
					</Stack>
				}
				bordered
				bodyFill
			>
				<Table
					height={500}
					data={currencies}
					sortColumn={sortColumn}
					sortType={sortType}
					onSortColumn={handleSortColumn}
					loading={loading}
					wordWrap='break-word'
				>
					<Column flexGrow={1} fixed sortable verticalAlign='middle'>
						<HeaderCell>Name</HeaderCell>
						<Cell dataKey='name' />
					</Column>

					<Column flexGrow={2} fixed sortable verticalAlign='middle'>
						<HeaderCell>Country</HeaderCell>
						<Cell dataKey='country' />
					</Column>

					<Column flexGrow={1} fixed sortable verticalAlign='middle'>
						<HeaderCell>Symbol</HeaderCell>
						<Cell dataKey='symbol' />
					</Column>

					<Column flexGrow={1} fixed sortable verticalAlign='middle'>
						<HeaderCell>Abbreviation</HeaderCell>
						<Cell dataKey='abbreviation' />
					</Column>

					<Column flexGrow={1} sortable verticalAlign='middle'>
						<HeaderCell>Status</HeaderCell>
						<Cell dataKey='isActive'>
							{rowData => <Status active={rowData.isActive} />}
						</Cell>
					</Column>

					<Column flexGrow={1} sortable verticalAlign='middle'>
						<HeaderCell>Last Modified</HeaderCell>
						<Cell dataKey='updatedAt'>
							{rowData => formatDate(rowData.updatedAt)}
						</Cell>
					</Column>

					<Column flexGrow={1} align='center' verticalAlign='middle'>
						<HeaderCell>...</HeaderCell>

						<Cell style={{ padding: '6px' }}>
							{rowData => (
								<>
									<Button
										appearance='link'
										onClick={() =>
											dispatch(setDrawerOpen({ mode: 'edit', data: rowData }))
										}
										style={{ padding: 0, marginRight: '.7em' }}
									>
										<EditIcon />
									</Button>
									<Button
										appearance='link'
										color='red'
										onClick={() => dispatch(setModalOpen(rowData))}
										style={{ padding: 0, marginRight: '.7em' }}
									>
										<TrashIcon />
									</Button>
									<Button
										appearance='link'
										color='yellow'
										onClick={() => handleOpen(rowData)}
										style={{ padding: 0 }}
									>
										<HistoryIcon />
									</Button>
								</>
							)}
						</Cell>
					</Column>
				</Table>
			</Panel>
			<div style={{ padding: '1em 0' }}>
				<Pagination
					prev
					next
					first
					last
					ellipsis
					boundaryLinks
					maxButtons={5}
					size='xs'
					layout={['total', '-', 'limit', '|', 'pager']}
					total={count}
					limitOptions={[10, 30, 50]}
					limit={limit}
					activePage={page}
					onChangePage={handlePageChange}
					onChangeLimit={handleChangeLimit}
				/>
			</div>

			<Modal open={open} onClose={handleClose} size='lg'>
				<Modal.Header>
					<Modal.Title>Exchange Rate History</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<CurrencyRateHistory currencyData={currency} />
				</Modal.Body>
			</Modal>
		</div>
	)
}
export default CurrenciesTable
