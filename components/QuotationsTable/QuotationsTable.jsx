'use client'

import {
	Button,
	IconButton,
	Pagination,
	Panel,
	Stack,
	Table,
} from 'rsuite'
import TableSearch from '../TableSearch/TableSearch'

import VisibleIcon from '@rsuite/icons/Visible'
import PlusIcon from '@rsuite/icons/Plus'

import { useState } from 'react'
import { formatDate } from '@/utils/functions'
import { useSelector } from 'react-redux'

import {
	limitQuotations,
	paginateQuotations,
	searchQuotations,
	sortQuotations,
} from '@/redux/features/quotations/quotationsActions'
import {
	getQuotationsCount,
	getQuotationsLoadingState,
	selectAllQuotations,
} from '@/redux/features/quotations/quotationsSlice'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const { Column, HeaderCell, Cell } = Table

const QuotationsTable = () => {
	const router = useRouter()
	const [sortType, setSortType] = useState('desc')
	const [sortColumn, setSortColumn] = useState('createdAt')
	const [limit, setLimit] = useState(10)
	const [page, setPage] = useState(1)

	const quotations = useSelector(selectAllQuotations)
	const count = useSelector(getQuotationsCount)
	const loading = useSelector(getQuotationsLoadingState)

	const handleSortColumn = async (sortColumn, sortType) => {
		sortQuotations(limit, page, sortColumn, sortType)
		setSortColumn(sortColumn)
		setSortType(sortType)
	}

	const handleChangeLimit = async dataKey => {
		setPage(1)
		setLimit(dataKey)
		limitQuotations(dataKey)
	}

	const handlePageChange = async value => {
		setPage(value)
		paginateQuotations(limit, value, sortColumn, sortType)
	}

	let typingTimer
	const handleSearch = async query => {
		clearTimeout(typingTimer)

		typingTimer = setTimeout(() => {
			searchQuotations(query, limit, page)
		}, 1000)
	}

	return (
		<div>
			<Panel
				header={
					<Stack justifyContent='space-between'>
						<span>Quotations List</span>
						<Stack spacing={10}>
							<TableSearch handleSearch={handleSearch} />
							<IconButton
								icon={<PlusIcon />}
								circle
								size='sm'
								appearance='primary'
								as={Link}
								href='/quotations/new'
							/>
						</Stack>
					</Stack>
				}
				bordered
				bodyFill
			>
				<Table
					autoHeight
					data={quotations}
					sortColumn={sortColumn}
					sortType={sortType}
					onSortColumn={handleSortColumn}
					loading={loading}
					wordWrap='break-word'
				>
					<Column flexGrow={1} fixed sortable verticalAlign='middle'>
						<HeaderCell>Quotation number</HeaderCell>
						<Cell dataKey='quotationNumber' />
					</Column>

					<Column flexGrow={1} fixed verticalAlign='middle'>
						<HeaderCell>Created by</HeaderCell>
						<Cell>
							{rowData =>
								rowData.createdBy.firstName + ' ' + rowData.createdBy.lastName
							}
						</Cell>
					</Column>

					<Column flexGrow={1} fixed verticalAlign='middle'>
						<HeaderCell>Customer</HeaderCell>
						<Cell>
							{rowData =>
								rowData.contact.firstName + ' ' + rowData.contact.lastName
							}
						</Cell>
					</Column>

					<Column flexGrow={1} fixed verticalAlign='middle'>
						<HeaderCell>Order number</HeaderCell>
						<Cell>{rowData => rowData.order?.orderNumber || 'N/A'}</Cell>
					</Column>

					<Column flexGrow={1} sortable verticalAlign='middle'>
						<HeaderCell>Quotation date</HeaderCell>
						<Cell dataKey='createdAt'>
							{rowData => formatDate(rowData.createdAt)}
						</Cell>
					</Column>

					<Column flexGrow={1} align='center' verticalAlign='middle'>
						<HeaderCell>...</HeaderCell>

						<Cell style={{ padding: '6px' }}>
							{rowData => (
								<>
									<Button
										appearance='link'
										onClick={() => {
											router.refresh()
										}}
										as={Link}
										href={`/quotations/${rowData.quotationNumber}`}
										style={{ padding: 0, marginRight: '.7em' }}
									>
										<VisibleIcon />
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
		</div>
	)
}
export default QuotationsTable
