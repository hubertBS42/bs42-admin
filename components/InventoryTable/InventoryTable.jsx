'use client'

import {
	Button,
	IconButton,
	InputPicker,
	Pagination,
	Panel,
	SelectPicker,
	Stack,
	Table,
} from 'rsuite'
import TableSearch from '../TableSearch/TableSearch'

import TrashIcon from '@rsuite/icons/Trash'
import EditIcon from '@rsuite/icons/Edit'
import PlusIcon from '@rsuite/icons/Plus'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
	limitInventory,
	loadInventory,
	paginateInventory,
	searchInventory,
	sortInventory,
} from '@/redux/features/inventory/inventoryActions'

import {
	getInventoryCount,
	getInventoryLoadingState,
	selectAllInventory,
	selectAllLocations,
	selectCurrLocation,
	selectLimitedInventory,
	setCurrLocation,
} from '@/redux/features/inventory/inventorySlice'

import { setModalOpen } from '@/redux/features/modal/modalSlice'
import { setDrawerOpen } from '@/redux/features/drawer/drawerSlice'
import Status from '../Status/Status'

const { Column, HeaderCell, Cell } = Table

const InventoryTable = () => {
	const dispatch = useDispatch()

	const [sortType, setSortType] = useState('asc')
	const [sortColumn, setSortColumn] = useState('count')
	const [limit, setLimit] = useState(10)
	const [page, setPage] = useState(1)

	const limitedInventory = useSelector(selectLimitedInventory)
	const allInventory = useSelector(selectAllInventory)
	const location = useSelector(selectCurrLocation)
	const locations = useSelector(selectAllLocations)
	const count = useSelector(getInventoryCount)
	const loading = useSelector(getInventoryLoadingState)

	const handleSortColumn = async (sortColumn, sortType) => {
		sortInventory(limit, page, sortColumn, sortType, location)
		setSortColumn(sortColumn)
		setSortType(sortType)
	}

	const handleChangeLimit = async dataKey => {
		setPage(1)
		setLimit(dataKey)
		limitInventory(dataKey, location)
		setSortType('asc')
	}

	const handlePageChange = async value => {
		setPage(value)
		paginateInventory(limit, value, sortColumn, sortType, location)
	}

	let typingTimer
	const handleSearch = async query => {
		clearTimeout(typingTimer)

		typingTimer = setTimeout(() => {
			searchInventory(query, limit, page, location)
		}, 1000)
	}

	return (
		<div>
			<Panel
				header={
					<Stack justifyContent='space-between'>
						<SelectPicker
							data={locations.map(location => ({
								label: location.name,
								value: location._id,
							}))}
							searchable={false}
							label='Location'
							value={location}
							cleanable={false}
							onChange={id => {
								loadInventory(id)
								setSortType('asc')
								setSortColumn('count')
								setLimit(10)
								setPage(1)
							}}
						/>
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
					data={limitedInventory}
					sortColumn={sortColumn}
					sortType={sortType}
					onSortColumn={handleSortColumn}
					loading={loading}
					wordWrap='break-word'
				>
					<Column flexGrow={3} fixed verticalAlign='middle'>
						<HeaderCell>Title</HeaderCell>
						<Cell>{rowData => rowData.product.title}</Cell>
					</Column>

					<Column flexGrow={1} fixed sortable verticalAlign='middle'>
						<HeaderCell>Stock count</HeaderCell>
						<Cell dataKey='count' />
					</Column>

					<Column flexGrow={1} fixed sortable verticalAlign='middle'>
						<HeaderCell>Min stock count</HeaderCell>
						<Cell dataKey='min' />
					</Column>

					<Column flexGrow={1} fixed sortable verticalAlign='middle'>
						<HeaderCell>Max stock count</HeaderCell>
						<Cell dataKey='max' />
					</Column>

					{/* <Column flexGrow={1} sortable verticalAlign='middle'>
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
					</Column> */}

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
export default InventoryTable
