'use client'
import { Button, IconButton, Panel, Stack, Table } from 'rsuite'
import OrderStatus from '../OrderStatus/OrderStatus'
import { formatDate } from '@/utils/functions'

import VisibleIcon from '@rsuite/icons/Visible'
import PlusIcon from '@rsuite/icons/Plus'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const { Column, HeaderCell, Cell } = Table

const RecentOrdersCard = ({ data }) => {
	const router = useRouter()
	return (
		<Panel
			header={
				<Stack justifyContent='space-between'>
					<span>Recent Orders</span>
					<IconButton
						icon={<PlusIcon />}
						circle
						size='xs'
						appearance='primary'
						as={Link}
						href='/orders/new'
					/>
				</Stack>
			}
			bordered
			bodyFill
		>
			<Table autoHeight data={data} wordWrap='break-word'>
				<Column flexGrow={1} fixed verticalAlign='middle'>
					<HeaderCell>Order number</HeaderCell>
					<Cell dataKey='orderNumber' />
				</Column>

				<Column flexGrow={2} fixed verticalAlign='middle'>
					<HeaderCell>Customer</HeaderCell>
					<Cell>
						{rowData =>
							rowData.contact.firstName + ' ' + rowData.contact.lastName
						}
					</Cell>
				</Column>

				<Column flexGrow={1} verticalAlign='middle'>
					<HeaderCell>Status</HeaderCell>
					<Cell dataKey='isActive'>
						{rowData => <OrderStatus data={rowData} />}
					</Cell>
				</Column>

				<Column flexGrow={1} verticalAlign='middle'>
					<HeaderCell>Order date</HeaderCell>
					<Cell dataKey='createdAt'>
						{rowData => formatDate(rowData.createdAt)}
					</Cell>
				</Column>

				<Column align='center' verticalAlign='middle'>
					<HeaderCell>...</HeaderCell>

					<Cell style={{ padding: '6px' }}>
						{rowData => (
							<>
								<Button
									appearance='link'
									onClick={() => {
										router.refresh()
									}}
									as={Link}
									href={`/orders/${rowData.orderNumber}`}
									style={{ padding: 0, marginRight: '.7em' }}
								>
									<VisibleIcon />
								</Button>
							</>
						)}
					</Cell>
				</Column>
			</Table>
		</Panel>
	)
}
export default RecentOrdersCard
