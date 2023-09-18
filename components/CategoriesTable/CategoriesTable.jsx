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
	limitCategories,
	paginateCategories,
	searchCategories,
	sortCategories,
} from '@/redux/features/categories/categoriesActions'
import Status from '../Status/Status'
import {
	getCategoriesCount,
	getCategoriesLoadingState,
	selectLimitedCategories,
} from '@/redux/features/categories/categoriesSlice'
import { setModalOpen } from '@/redux/features/modal/modalSlice'
import { setDrawerOpen } from '@/redux/features/drawer/drawerSlice'

const { Column, HeaderCell, Cell } = Table

const CategoriesTable = () => {
	const dispatch = useDispatch()

	const [sortType, setSortType] = useState('desc')
	const [sortColumn, setSortColumn] = useState('createdAt')
	const [limit, setLimit] = useState(10)
	const [page, setPage] = useState(1)

	const categories = useSelector(selectLimitedCategories)
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
				<Table
					height={500}
					isTree
					defaultExpandAllRows
					rowKey='slug'
					data={categories}
					sortColumn={sortColumn}
					sortType={sortType}
					onSortColumn={handleSortColumn}
					loading={loading}
					shouldUpdateScroll={true}
					renderTreeToggle={(icon, rowData) => {
						if (rowData.children && rowData.children.length === 0) {
							return
						}
						return icon
					}}
				>
					<Column flexGrow={1} fixed sortable verticalAlign='middle'>
						<HeaderCell>Name</HeaderCell>
						<Cell dataKey='name' />
					</Column>

					<Column flexGrow={1} verticalAlign='middle'>
						<HeaderCell>Slug</HeaderCell>
						<Cell dataKey='slug' />
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
export default CategoriesTable
