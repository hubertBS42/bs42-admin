'use client'

import {
	Button,
	IconButton,
	Loader,
	Panel,
	Stack,
	Table,
} from 'rsuite'

import TrashIcon from '@rsuite/icons/Trash'
import EditIcon from '@rsuite/icons/Edit'
import PlusIcon from '@rsuite/icons/Plus'

import { formatLocationsForTable } from '@/utils/functions'
import { useDispatch, useSelector } from 'react-redux'

import { setModalOpen } from '@/redux/features/modal/modalSlice'
import { setDrawerOpen } from '@/redux/features/drawer/drawerSlice'
import {
	getLocationsLoadingState,
	selectAllLocations,
} from '@/redux/features/locations/locationsSlice'

const { Column, HeaderCell, Cell } = Table

const StorageMap = ({ id }) => {
	const isLoading = useSelector(getLocationsLoadingState)
	const locations = useSelector(selectAllLocations)
	const dispatch = useDispatch()

	const formattedLocations = formatLocationsForTable(locations, id)

	return (
		<div>
			<Panel
				header={
					<Stack justifyContent='space-between'>
						<span>Storage map</span>

						<IconButton
							icon={<PlusIcon />}
							circle
							size='sm'
							appearance='primary'
							onClick={() => dispatch(setDrawerOpen({ mode: 'add' }))}
						/>
					</Stack>
				}
				bordered
				bodyFill
			>
				{!isLoading ? (
					<Table
						isTree
						defaultExpandAllRows
						autoHeight
						rowKey='name'
						data={formattedLocations}
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

						{/* <Column flexGrow={1} verticalAlign='middle'>
							<HeaderCell>Status</HeaderCell>
							<Cell dataKey='isActive'>
								{rowData => <Status active={rowData.isActive} />}
							</Cell>
						</Column> */}

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
export default StorageMap
