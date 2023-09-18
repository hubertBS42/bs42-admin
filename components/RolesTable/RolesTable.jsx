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
	limitRoles,
	paginateRoles,
	searchRoles,
	sortRoles,
} from '@/redux/features/roles/rolesActions'
import Status from '../Status/Status'
import {
	getRolesCount,
	getRolesLoadingState,
	selectLimitedRoles,
} from '@/redux/features/roles/rolesSlice'
import { setModalOpen } from '@/redux/features/modal/modalSlice'
import { setDrawerOpen } from '@/redux/features/drawer/drawerSlice'
import CustomTagGroup from '../CustomTagGroup/CustomTagGroup'

const { Column, HeaderCell, Cell } = Table

const RolesTable = () => {
	const dispatch = useDispatch()

	const [sortType, setSortType] = useState('desc')
	const [sortColumn, setSortColumn] = useState('createdAt')
	const [limit, setLimit] = useState(10)
	const [page, setPage] = useState(1)

	const roles = useSelector(selectLimitedRoles)
	const count = useSelector(getRolesCount)
	const loading = useSelector(getRolesLoadingState)

	const handleSortColumn = async (sortColumn, sortType) => {
		sortRoles(limit, page, sortColumn, sortType)
		setSortColumn(sortColumn)
		setSortType(sortType)
	}

	const handleChangeLimit = async dataKey => {
		setPage(1)
		setLimit(dataKey)
		limitRoles(dataKey)
	}

	const handlePageChange = async value => {
		setPage(value)
		paginateRoles(limit, value, sortColumn, sortType)
	}

	let typingTimer
	const handleSearch = async query => {
		clearTimeout(typingTimer)

		typingTimer = setTimeout(() => {
			searchRoles(query, limit, page)
		}, 1000)
	}

	return (
		<div>
			<Panel
				header={
					<Stack justifyContent='space-between'>
						<span>Role List</span>
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
					data={roles}
					sortColumn={sortColumn}
					sortType={sortType}
					onSortColumn={handleSortColumn}
					loading={loading}
					wordWrap='break-word'
				>
					<Column flexGrow={1} fixed sortable verticalAlign='middle'>
						<HeaderCell>Title</HeaderCell>
						<Cell dataKey='title' />
					</Column>

					<Column flexGrow={1}>
						<HeaderCell>Resources</HeaderCell>
						<Cell>
							{rowData => <CustomTagGroup data={rowData.permissions} />}
						</Cell>
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
export default RolesTable
