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
import { formatDate, roundMoney } from '@/utils/functions'
import { useDispatch, useSelector } from 'react-redux'

import {
	limitInventoryOrders,
	paginateInventoryOrders,
	searchInventoryOrders,
	sortInventoryOrders,
} from '@/redux/features/inventoryOrders/inventoryOrdersActions'
import {
	getInventoryOrdersCount,
	getInventoryOrdersLoadingState,
	selectAllInventoryOrders,
} from '@/redux/features/inventoryOrders/inventoryOrdersSlice'
import { setDrawerOpen } from '@/redux/features/drawer/drawerSlice'
import OrderStatus from '../OrderStatus/OrderStatus'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const { Column, HeaderCell, Cell } = Table

const InventoryOrdersTable = () => {
	const dispatch = useDispatch()
	const router = useRouter()
	const [sortType, setSortType] = useState('desc')
	const [sortColumn, setSortColumn] = useState('createdAt')
	const [limit, setLimit] = useState(10)
	const [page, setPage] = useState(1)

	const inventoryOrders = useSelector(selectAllInventoryOrders)
	const count = useSelector(getInventoryOrdersCount)
	const loading = useSelector(getInventoryOrdersLoadingState)

	const handleSortColumn = async (sortColumn, sortType) => {
		sortInventoryOrders(limit, page, sortColumn, sortType)
		setSortColumn(sortColumn)
		setSortType(sortType)
	}

	const handleChangeLimit = async dataKey => {
		setPage(1)
		setLimit(dataKey)
		limitInventoryOrders(dataKey)
	}

	const handlePageChange = async value => {
		setPage(value)
		paginateInventoryOrders(limit, value, sortColumn, sortType)
	}

	let typingTimer
	const handleSearch = async query => {
		clearTimeout(typingTimer)

		typingTimer = setTimeout(() => {
			searchInventoryOrders(query, limit, page)
		}, 1000)
	}

	return (
		<div>
			<Panel
				header={
					<Stack justifyContent='space-between'>
						<span>Inventory Orders List</span>
						<Stack spacing={10}>
							<TableSearch handleSearch={handleSearch} />
							<IconButton
								icon={<PlusIcon />}
								circle
								size='sm'
								appearance='primary'
								as={Link}
								href='/inventory-orders/new'
							/>
						</Stack>
					</Stack>
				}
				bordered
				bodyFill
			>
				<Table
					autoHeight
					data={inventoryOrders}
					sortColumn={sortColumn}
					sortType={sortType}
					onSortColumn={handleSortColumn}
					loading={loading}
					wordWrap='break-word'
				>
					<Column flexGrow={1} fixed sortable verticalAlign='middle'>
						<HeaderCell>Order number</HeaderCell>
						<Cell dataKey='orderNumber' />
					</Column>

					<Column flexGrow={1} fixed verticalAlign='middle'>
						<HeaderCell>User</HeaderCell>
						<Cell>
							{rowData =>
								rowData.user.firstName + ' ' + rowData.user.lastName
							}
						</Cell>
					</Column>

					<Column flexGrow={1} fixed sortable verticalAlign='middle'>
						<HeaderCell>Supplier</HeaderCell>
						<Cell dataKey='supplier'>
							{rowData => rowData.supplier.name}
						</Cell>
					</Column>

					<Column flexGrow={1} fixed sortable verticalAlign='middle'>
						<HeaderCell>Total</HeaderCell>
						<Cell dataKey='total'>
							{rowData => `$${roundMoney(rowData.total)}`}
						</Cell>
					</Column>

					<Column flexGrow={1} sortable verticalAlign='middle'>
						<HeaderCell>Status</HeaderCell>
						<Cell dataKey='status'>
							{rowData => <OrderStatus data={rowData} />}
						</Cell>
					</Column>

					<Column flexGrow={1} sortable verticalAlign='middle'>
						<HeaderCell>Order date</HeaderCell>
						<Cell dataKey='createdAt'>
							{rowData => formatDate(rowData.createdAt)}
						</Cell>
					</Column>

					<Column align='center' verticalAlign='middle'>
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
										href={`/inventory-orders/${rowData.orderNumber}`}
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
export default InventoryOrdersTable
