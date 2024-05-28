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
import { useDispatch, useSelector } from 'react-redux'

import {
	limitOrders,
	paginateOrders,
	searchOrders,
	sortOrders,
} from '@/redux/features/orders/ordersActions'
import {
	getOrdersCount,
	getOrdersLoadingState,
	selectAllOrders,
} from '@/redux/features/orders/ordersSlice'
import { setDrawerOpen } from '@/redux/features/drawer/drawerSlice'
import OrderStatus from '../OrderStatus/OrderStatus'
import Link from 'next/link'

const { Column, HeaderCell, Cell } = Table

const OrdersTable = () => {
	const dispatch = useDispatch()

	const [sortType, setSortType] = useState('desc')
	const [sortColumn, setSortColumn] = useState('createdAt')
	const [limit, setLimit] = useState(10)
	const [page, setPage] = useState(1)

	const orders = useSelector(selectAllOrders)
	const count = useSelector(getOrdersCount)
	const loading = useSelector(getOrdersLoadingState)

	const handleSortColumn = async (sortColumn, sortType) => {
		sortOrders(limit, page, sortColumn, sortType)
		setSortColumn(sortColumn)
		setSortType(sortType)
	}

	const handleChangeLimit = async dataKey => {
		setPage(1)
		setLimit(dataKey)
		limitOrders(dataKey)
	}

	const handlePageChange = async value => {
		setPage(value)
		paginateOrders(limit, value, sortColumn, sortType)
	}

	let typingTimer
	const handleSearch = async query => {
		clearTimeout(typingTimer)

		typingTimer = setTimeout(() => {
			searchOrders(query, limit, page)
		}, 1000)
	}

	return (
		<div>
			<Panel
				header={
					<Stack justifyContent='space-between'>
						<span>Orders List</span>
						<Stack spacing={10}>
							<TableSearch handleSearch={handleSearch} />
							<IconButton
								icon={<PlusIcon />}
								circle
								size='sm'
								appearance='primary'
								as={Link}
								href='/orders/new'
							/>
						</Stack>
					</Stack>
				}
				bordered
				bodyFill
			>
				<Table
					autoHeight
					data={orders}
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

					<Column flexGrow={1} fixed sortable verticalAlign='middle'>
						<HeaderCell>Customer</HeaderCell>
						<Cell>
							{rowData =>
								rowData.contact.firstName + ' ' + rowData.contact.lastName
							}
						</Cell>
					</Column>

					<Column flexGrow={1} sortable verticalAlign='middle'>
						<HeaderCell>Status</HeaderCell>
						<Cell dataKey='isActive'>
							{rowData => <OrderStatus data={rowData} />}
						</Cell>
					</Column>

					<Column flexGrow={1} sortable verticalAlign='middle'>
						<HeaderCell>Order date</HeaderCell>
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
										as={Link}
										href={`/orders/${rowData.orderNumber}`}
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
export default OrdersTable
