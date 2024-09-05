'use client'

import {
	Button,
	IconButton,
	Loader,
	Panel,
	Stack,
	Table,
} from 'rsuite'
import TableSearch from '../TableSearch/TableSearch'

import TrashIcon from '@rsuite/icons/Trash'
import EditIcon from '@rsuite/icons/Edit'
import PlusIcon from '@rsuite/icons/Plus'

import { formatCategoriesForTable } from '@/utils/functions'
import { useDispatch, useSelector } from 'react-redux'

import { searchCategories } from '@/redux/features/categories/categoriesActions'
import Status from '../Status/Status'
import {
	getCategoriesLoadingState,
	selectAllCategories,
} from '@/redux/features/categories/categoriesSlice'
import { setModalOpen } from '@/redux/features/modal/modalSlice'
import { setDrawerOpen } from '@/redux/features/drawer/drawerSlice'

const { Column, HeaderCell, Cell } = Table

const CategoriesTable = () => {
	const dispatch = useDispatch()

	const categories = useSelector(selectAllCategories)
	const formattedCategories = formatCategoriesForTable(categories)
	const loading = useSelector(getCategoriesLoadingState)

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
				{!loading ? (
					<Table
						isTree
						defaultExpandAllRows
						autoHeight
						rowKey='name'
						data={formattedCategories}
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
					<Stack
						justifyContent='center'
						alignItems='center'
						style={{ height: 400 }}
					>
						<Loader content='Loading...' vertical />
					</Stack>
				)}
			</Panel>
		</div>
	)
}
export default CategoriesTable
