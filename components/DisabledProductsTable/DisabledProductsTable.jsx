'use client'

import {
	Button,
	Cascader,
	Pagination,
	Panel,
	Stack,
	Table,
} from 'rsuite'
import TableSearch from '../TableSearch/TableSearch'

import TrashIcon from '@rsuite/icons/Trash'
import EditIcon from '@rsuite/icons/Edit'

import { useState } from 'react'
import {
	formatCategoriesForTreePicker,
	formatDate,
} from '@/utils/functions'
import { useDispatch, useSelector } from 'react-redux'

import Status from '../Status/Status'
import {
	getProductsLoadingState,
	selectAllDisabledProducts,
} from '@/redux/features/products/productsSlice'
import { setModalOpen } from '@/redux/features/modal/modalSlice'
import { setDrawerOpen } from '@/redux/features/drawer/drawerSlice'
import { selectAllCategories } from '@/redux/features/categories/categoriesSlice'

const { Column, HeaderCell, Cell } = Table

const DisabledProductsTable = () => {
	const dispatch = useDispatch()

	const [searchTerm, setSearchTerm] = useState('')

	const products = useSelector(selectAllDisabledProducts)
	const count = products.length
	const loading = useSelector(getProductsLoadingState)
	let categories = useSelector(selectAllCategories)
	categories = formatCategoriesForTreePicker(categories)

	const handleSearch = async query => {
		setSearchTerm(query)
	}

	return (
		<div>
			<Panel
				header={
					<Stack justifyContent='space-between'>
						<span>Product List</span>
						<Stack spacing={10}>
							<TableSearch handleSearch={handleSearch} />
						</Stack>
					</Stack>
				}
				bordered
				bodyFill
			>
				<Table
					height={500}
					data={products.filter(product =>
						product.title.toLowerCase().includes(searchTerm.toLowerCase())
					)}
					loading={loading}
					wordWrap='break-word'
					style={{ fontSize: '13px' }}
				>
					<Column flexGrow={2} fixed verticalAlign='middle'>
						<HeaderCell>Title</HeaderCell>
						<Cell dataKey='title' />
					</Column>

					<Column flexGrow={3} verticalAlign='middle'>
						<HeaderCell>Category</HeaderCell>
						<Cell>
							{rowData => (
								<Cascader
									plaintext
									value={rowData?.category}
									data={categories}
								/>
							)}
						</Cell>
					</Column>

					<Column flexGrow={1} fixed verticalAlign='middle'>
						<HeaderCell>Manufacturer</HeaderCell>
						<Cell dataKey='manufacturer'>
							{rowData => rowData?.manufacturer?.name || 'Not selected'}
						</Cell>
					</Column>

					<Column flexGrow={1} verticalAlign='middle'>
						<HeaderCell>Status</HeaderCell>
						<Cell dataKey='isActive'>
							{rowData => <Status active={rowData.isActive} />}
						</Cell>
					</Column>

					<Column flexGrow={1} verticalAlign='middle'>
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
				<Pagination size='xs' layout={['total']} total={count} />
			</div>
		</div>
	)
}
export default DisabledProductsTable
