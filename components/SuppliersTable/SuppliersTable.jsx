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

import TrashIcon from '@rsuite/icons/Trash'
import EditIcon from '@rsuite/icons/Edit'
import PlusIcon from '@rsuite/icons/Plus'

import { useState } from 'react'
import { formatDate } from '@/utils/functions'
import { useDispatch, useSelector } from 'react-redux'

import {
	limitSuppliers,
	paginateSuppliers,
	searchSuppliers,
	sortSuppliers,
} from '@/redux/features/suppliers/suppliersActions'

import {
	getSuppliersCount,
	getSuppliersLoadingState,
	selectAllSuppliers,
} from '@/redux/features/suppliers/suppliersSlice'
import { setModalOpen } from '@/redux/features/modal/modalSlice'
import { setDrawerOpen } from '@/redux/features/drawer/drawerSlice'
import Status from '../Status/Status'

const { Column, HeaderCell, Cell } = Table

const SuppliersTable = () => {
	const dispatch = useDispatch()

	const [sortType, setSortType] = useState('desc')
	const [sortColumn, setSortColumn] = useState('createdAt')
	const [limit, setLimit] = useState(10)
	const [page, setPage] = useState(1)

	const suppliers = useSelector(selectAllSuppliers)
	const count = useSelector(getSuppliersCount)
	const loading = useSelector(getSuppliersLoadingState)

	const handleSortColumn = async (sortColumn, sortType) => {
		sortSuppliers(limit, page, sortColumn, sortType)
		setSortColumn(sortColumn)
		setSortType(sortType)
	}

	const handleChangeLimit = async dataKey => {
		setPage(1)
		setLimit(dataKey)
		limitSuppliers(dataKey)
	}

	const handlePageChange = async value => {
		setPage(value)
		paginateSuppliers(limit, value, sortColumn, sortType)
	}

	let typingTimer
	const handleSearch = async query => {
		clearTimeout(typingTimer)

		typingTimer = setTimeout(() => {
			searchSuppliers(query, limit, page)
		}, 1000)
	}

	return (
		<div>
			<Panel
				header={
					<Stack justifyContent='space-between'>
						<span>Suppliers List</span>
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
					autoHeight
					data={suppliers}
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

					<Column flexGrow={1} sortable verticalAlign='middle'>
						<HeaderCell>Status</HeaderCell>
						<Cell dataKey='isActive'>
							{rowData => <Status active={rowData.isActive} />}
						</Cell>
					</Column>

					<Column flexGrow={1} sortable verticalAlign='middle'>
						<HeaderCell>Dated created</HeaderCell>
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
										style={{ padding: 0 }}
									>
										<TrashIcon />
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
export default SuppliersTable
