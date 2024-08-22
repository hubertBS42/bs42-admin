'use client'

import {
	Button,
	IconButton,
	Loader,
	Pagination,
	Panel,
	Placeholder,
	Stack,
	Table,
} from 'rsuite'
import TableSearch from '../TableSearch/TableSearch'

import TrashIcon from '@rsuite/icons/Trash'
import EditIcon from '@rsuite/icons/Edit'
import PlusIcon from '@rsuite/icons/Plus'

import { useEffect, useState } from 'react'
import {
	formatCategoriesForTable,
	formatDate,
} from '@/utils/functions'
import { useDispatch, useSelector } from 'react-redux'

import {
	limitCategories,
	paginateCategories,
	searchCategories,
	sortCategories,
} from '@/redux/features/categories/categoriesActions'
import Status from '../Status/Status'
import {
	getCategoriesCount,
	getCategoriesLoadingState,
	selectAllCategories,
	selectLimitedCategories,
} from '@/redux/features/categories/categoriesSlice'
import { setModalOpen } from '@/redux/features/modal/modalSlice'
import { setDrawerOpen } from '@/redux/features/drawer/drawerSlice'

const { Column, HeaderCell, Cell } = Table

const CategoriesTable = () => {
	const dispatch = useDispatch()

	const [sortType, setSortType] = useState('desc')
	const [sortColumn, setSortColumn] = useState('name')
	const [limit, setLimit] = useState(10)
	const [page, setPage] = useState(1)

	const categories = useSelector(selectAllCategories)
	const formattedCategories = formatCategoriesForTable(categories)

	const count = useSelector(getCategoriesCount)
	const loading = useSelector(getCategoriesLoadingState)

	const handleSortColumn = async (sortColumn, sortType) => {
		sortCategories(limit, page, sortColumn, sortType)
		setSortColumn(sortColumn)
		setSortType(sortType)
	}

	const handleChangeLimit = async dataKey => {
		setPage(1)
		setLimit(dataKey)
		limitCategories(dataKey)
	}

	const handlePageChange = async value => {
		setPage(value)
		paginateCategories(limit, value, sortColumn, sortType)
	}

	let typingTimer
	const handleSearch = async query => {
		clearTimeout(typingTimer)

		typingTimer = setTimeout(() => {
			searchCategories(query, limit, page)
		}, 1000)
	}

	const testData = [
		{
			slug: 'computing',
			parent: null,
			name: 'Computing',
			isActive: true,
			id: '64ce89a43f5ddb8205f16582',
			createdAt: '2023-08-05T17:40:52.767Z',
			children: [
				{
					id: '64ce89a43f5ddb8205f16582',
					slug: 'computers-and-accessories',
					parent: '64ce89a43f5ddb8205f16582',
					isActive: true,
					createdAt: '2023-08-02T14:07:39.807Z',
					name: 'Computers & Accessories',
					children: [
						{
							id: '64ca14e20a17f2d8ccbafee1',
							name: 'Date Storage',
							parent: '64ca632be4c66765cd5db752',
							isActive: true,
							slug: 'data-storage',
							createdAt: '2023-08-02T08:33:38.170Z',
							children: [],
						},
					],
				},
			],
		},
	]

	return (
		<div>
			<Panel
				header={
					<Stack justifyContent='space-between'>
						<span>Category List</span>

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
				{!loading ? (
					<Table
						isTree
						defaultExpandAllRows
						autoHeight
						rowKey='name'
						data={formattedCategories}
						sortColumn={sortColumn}
						sortType={sortType}
						onSortColumn={handleSortColumn}
						shouldUpdateScroll={true}
						renderTreeToggle={(icon, rowData) => {
							if (rowData.children && rowData.children.length === 0) {
								return
							}
							return icon
						}}
					>
						<Column flexGrow={2} fixed verticalAlign='middle'>
							<HeaderCell>Name</HeaderCell>
							<Cell dataKey='name' />
						</Column>

						{/* <Column flexGrow={1} verticalAlign='middle'>
							<HeaderCell>Slug</HeaderCell>
							<Cell dataKey='slug' />
						</Column> */}

						<Column flexGrow={1} verticalAlign='middle'>
							<HeaderCell>Status</HeaderCell>
							<Cell dataKey='isActive'>
								{rowData => <Status active={rowData.isActive} />}
							</Cell>
						</Column>

						{/* <Column flexGrow={1} sortable verticalAlign='middle'>
							<HeaderCell>Dated created</HeaderCell>
							<Cell dataKey='createdAt'>
								{rowData => formatDate(rowData.createdAt)}
							</Cell>
						</Column> */}

						<Column align='center' verticalAlign='middle'>
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
				) : (
					<Placeholder.Graph height={500} active />
				)}
			</Panel>
			{/* <div style={{ padding: '1em 0' }}>
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
			</div> */}
		</div>
	)
}
export default CategoriesTable
