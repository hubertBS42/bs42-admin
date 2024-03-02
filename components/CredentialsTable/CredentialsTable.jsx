'use client'

import {
	Button,
	Col,
	IconButton,
	List,
	Pagination,
	Panel,
	Row,
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

import Status from '../Status/Status'

const { Column, HeaderCell, Cell } = Table

const CredentialsTable = ({ credentials }) => {
	const [sortType, setSortType] = useState('desc')

	const [sortColumn, setSortColumn] = useState('createdAt')

	// const handleSortColumn = async (sortColumn, sortType) => {
	// 	sortServers(limit, page, sortColumn, sortType)
	// 	setSortColumn(sortColumn)
	// 	setSortType(sortType)
	// }

	// const handleChangeLimit = async dataKey => {
	// 	setPage(1)
	// 	setLimit(dataKey)
	// 	limitServers(dataKey)
	// }

	// const handlePageChange = async value => {
	// 	setPage(value)
	// 	paginateServers(limit, value, sortColumn, sortType)
	// }

	// let typingTimer
	// const handleSearch = async query => {
	// 	clearTimeout(typingTimer)

	// 	typingTimer = setTimeout(() => {
	// 		searchServers(query, limit, page)
	// 	}, 1000)
	// }

	return (
		<div>
			<Panel
				header={
					<Stack justifyContent='space-between'>
						<span>Credentials</span>
						<IconButton
							icon={<PlusIcon />}
							circle
							size='xs'
							appearance='primary'
						/>
					</Stack>
				}
				bordered
				bodyFill
			>
				<List bordered>
					<List.Item>
						<Row style={{ fontSize: 12 }}>
							<Col xs={5} style={{ opacity: '.8' }}>
								Title
							</Col>
							<Col xs={5} style={{ opacity: '.8' }}>
								User
							</Col>
							<Col xs={6} style={{ opacity: '.8' }}>
								From Email
							</Col>
							<Col xs={6} style={{ opacity: '.8' }}>
								Date created
							</Col>
							<Col xs={2} style={{ opacity: '.8', textAlign: 'center' }}>
								...
							</Col>
						</Row>
					</List.Item>
					<List.Item>
						<Row style={{ fontSize: 12 }}>
							<Col xs={5}>Test</Col>
							<Col xs={5}>Test</Col>
							<Col xs={6}>Test</Col>
							<Col xs={6}>Test</Col>
							<Col
								xs={2}
								style={{
									textAlign: 'center',
								}}
							>
								<IconButton
									icon={<EditIcon />}
									appearance='link'
									style={{ padding: 0, marginRight: '.7em' }}
								/>
								<IconButton
									icon={<TrashIcon />}
									appearance='link'
									color='red'
									style={{ padding: 0 }}
								/>
							</Col>
						</Row>
					</List.Item>
				</List>
				{/* <Table
					autoHeight
					hover={false}
					data={credentials}
					// loading={loading}
				>
					<Column flexGrow={1} fixed verticalAlign='middle'>
						<HeaderCell>Title</HeaderCell>
						<Cell dataKey='title' />
					</Column>

					<Column flexGrow={1} fixed verticalAlign='middle'>
						<HeaderCell>User</HeaderCell>
						<Cell dataKey='user' />
					</Column>

					<Column flexGrow={1} fixed verticalAlign='middle'>
						<HeaderCell>From Email</HeaderCell>
						<Cell dataKey='fromEmail' />
					</Column>

					<Column flexGrow={1} verticalAlign='middle'>
						<HeaderCell>Dated created</HeaderCell>
						<Cell dataKey='timestamp'>
							{rowData => formatDate(rowData.timestamp)}
						</Cell>
					</Column>

					<Column flexGrow={1} align='center' verticalAlign='middle'>
						<HeaderCell>...</HeaderCell>

						<Cell style={{ padding: '6px' }}>
							{rowData => (
								<>
									<Button
										appearance='link'
										style={{ padding: 0, marginRight: '.7em' }}
									>
										<EditIcon />
									</Button>
									<Button appearance='link' color='red' style={{ padding: 0 }}>
										<TrashIcon />
									</Button>
								</>
							)}
						</Cell>
					</Column>
				</Table> */}
			</Panel>
		</div>
	)
}
export default CredentialsTable
