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

import ViewsAuthorizeIcon from '@rsuite/icons/ViewsAuthorize'

import { useState } from 'react'
import { formatDate, genFullName } from '@/utils/functions'
import { useDispatch, useSelector } from 'react-redux'

import {
	limitMessages,
	paginateMessages,
	searchMessages,
	sortMessages,
} from '@/redux/features/messages/messagesActions'
import {
	getMessagesCount,
	getMessagesLoadingState,
	selectAllMessages,
} from '@/redux/features/messages/messagesSlice'
import { setModalOpen } from '@/redux/features/modal/modalSlice'
import { setDrawerOpen } from '@/redux/features/drawer/drawerSlice'
import Status from '../Status/Status'
import MessageStatus from '../MessageStatus/MessageStatus'
import AcknowledgedStatus from '../AcknowledgedStatus/AcknowledgedStatus'

const { Column, HeaderCell, Cell } = Table

const MessagesTable = () => {
	const dispatch = useDispatch()

	const [sortType, setSortType] = useState('desc')
	const [sortColumn, setSortColumn] = useState('createdAt')
	const [limit, setLimit] = useState(10)
	const [page, setPage] = useState(1)

	const messages = useSelector(selectAllMessages)
	const count = useSelector(getMessagesCount)
	const loading = useSelector(getMessagesLoadingState)

	const handleSortColumn = async (sortColumn, sortType) => {
		sortMessages(limit, page, sortColumn, sortType)
		setSortColumn(sortColumn)
		setSortType(sortType)
	}

	const handleChangeLimit = async dataKey => {
		setPage(1)
		setLimit(dataKey)
		limitMessages(dataKey)
	}

	const handlePageChange = async value => {
		setPage(value)
		paginateMessages(limit, value, sortColumn, sortType)
	}

	let typingTimer
	const handleSearch = async query => {
		clearTimeout(typingTimer)

		typingTimer = setTimeout(() => {
			searchMessages(query, limit, page)
		}, 1000)
	}

	return (
		<div>
			<Panel
				header={
					<Stack justifyContent='space-between'>
						<span>Messages List</span>
						<Stack spacing={10}>
							<TableSearch handleSearch={handleSearch} />
						</Stack>
					</Stack>
				}
				bordered
				bodyFill
			>
				<Table
					autoHeight
					data={messages}
					sortColumn={sortColumn}
					sortType={sortType}
					onSortColumn={handleSortColumn}
					loading={loading}
					wordWrap='break-word'
				>
					<Column flexGrow={2} fixed sortable verticalAlign='middle'>
						<HeaderCell>Subject</HeaderCell>
						<Cell dataKey='subject' />
					</Column>

					<Column flexGrow={1} fixed sortable verticalAlign='middle'>
						<HeaderCell>Sender</HeaderCell>
						<Cell>
							{rowData =>
								rowData.sender.firstName + ' ' + rowData.sender.lastName
							}
						</Cell>
					</Column>

					<Column flexGrow={1} sortable verticalAlign='middle'>
						<HeaderCell>Attended by</HeaderCell>
						<Cell>
							{rowData =>
								rowData.acknowledgement
									? genFullName(
											rowData.acknowledgement.user.firstName,
											rowData.acknowledgement.user.lastName
									  )
									: 'N/A'
							}
						</Cell>
					</Column>

					<Column flexGrow={1} sortable verticalAlign='middle'>
						<HeaderCell>Status</HeaderCell>
						<Cell dataKey='isActive'>
							{rowData => <MessageStatus status={rowData.status} />}
						</Cell>
					</Column>

					<Column flexGrow={1} sortable verticalAlign='middle'>
						<HeaderCell>Sent date</HeaderCell>
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
										<ViewsAuthorizeIcon />
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
export default MessagesTable
