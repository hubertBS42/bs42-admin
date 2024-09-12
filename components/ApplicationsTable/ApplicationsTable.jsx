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

import { useState } from 'react'
import { formatDate } from '@/utils/functions'
import { useDispatch, useSelector } from 'react-redux'

import {
	limitApplications,
	paginateApplications,
	searchApplications,
	sortApplications,
} from '@/redux/features/applications/applicationsActions'
import {
	getApplicationsCount,
	getApplicationsLoadingState,
	selectAllApplications,
} from '@/redux/features/applications/applicationsSlice'
import { setDrawerOpen } from '@/redux/features/drawer/drawerSlice'

const { Column, HeaderCell, Cell } = Table

const ApplicationsTable = () => {
	const dispatch = useDispatch()

	const [sortType, setSortType] = useState('desc')
	const [sortColumn, setSortColumn] = useState('createdAt')
	const [limit, setLimit] = useState(10)
	const [page, setPage] = useState(1)

	const applications = useSelector(selectAllApplications)
	const count = useSelector(getApplicationsCount)
	const loading = useSelector(getApplicationsLoadingState)

	const handleSortColumn = async (sortColumn, sortType) => {
		sortApplications(limit, page, sortColumn, sortType)
		setSortColumn(sortColumn)
		setSortType(sortType)
	}

	const handleChangeLimit = async dataKey => {
		setPage(1)
		setLimit(dataKey)
		limitApplications(dataKey)
	}

	const handlePageChange = async value => {
		setPage(value)
		paginateApplications(limit, value, sortColumn, sortType)
	}

	let typingTimer
	const handleSearch = async query => {
		clearTimeout(typingTimer)

		typingTimer = setTimeout(() => {
			searchApplications(query, limit, page)
		}, 1000)
	}

	return (
		<div>
			<Panel
				header={
					<Stack justifyContent='space-between'>
						<span>Account Applications</span>
						<Stack spacing={10}>
							<TableSearch handleSearch={handleSearch} />
						</Stack>
					</Stack>
				}
				bordered
				bodyFill
			>
				<Table
					// height={500}
					autoHeight
					data={applications}
					sortColumn={sortColumn}
					sortType={sortType}
					onSortColumn={handleSortColumn}
					loading={loading}
					wordWrap='break-word'
				>
					<Column flexGrow={1} sortable verticalAlign='middle'>
						<HeaderCell>First Name</HeaderCell>
						<Cell dataKey='firstName' />
					</Column>

					<Column flexGrow={1} sortable verticalAlign='middle'>
						<HeaderCell>Last Name</HeaderCell>
						<Cell dataKey='lastName' />
					</Column>

					<Column flexGrow={1} sortable verticalAlign='middle'>
						<HeaderCell>Email</HeaderCell>
						<Cell dataKey='email' />
					</Column>

					{/* <Column flexGrow={1} sortable verticalAlign='middle'>
						<HeaderCell>Phone</HeaderCell>
						<Cell dataKey='phone1' />
					</Column> */}

					<Column flexGrow={1} sortable verticalAlign='middle'>
						<HeaderCell>Status</HeaderCell>
						<Cell>
							{rowData =>
								rowData.isApproved === null
									? 'Pending'
									: rowData.isApproved === true
									? 'Approved'
									: 'Rejected'
							}
						</Cell>
					</Column>

					<Column flexGrow={1} sortable verticalAlign='middle'>
						<HeaderCell>Date Submitted</HeaderCell>
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
										style={{ padding: 0 }}
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
export default ApplicationsTable
