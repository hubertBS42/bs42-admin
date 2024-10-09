'use client'
import {
	Button,
	Cascader,
	IconButton,
	Panel,
	Stack,
	Table,
} from 'rsuite'
import OrderStatus from '../OrderStatus/OrderStatus'
import {
	formatDate,
	formatForTreePicker,
	roundMoney,
} from '@/utils/functions'

import VisibleIcon from '@rsuite/icons/Visible'
import PlusIcon from '@rsuite/icons/Plus'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const { Column, HeaderCell, Cell } = Table

const TopSellersCard = ({ data, allCategories, rate }) => {
	const router = useRouter()
	const categories = formatForTreePicker(allCategories)
	return (
		<Panel header='Top Sellers' bordered bodyFill>
			<Table autoHeight data={data} wordWrap='break-word'>
				<Column flexGrow={1} fixed verticalAlign='middle'>
					<HeaderCell>Title</HeaderCell>
					<Cell dataKey='title' />
				</Column>

				{/* <Column flexGrow={2} fixed verticalAlign='middle'>
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
				</Column> */}

				<Column fixed verticalAlign='middle'>
					<HeaderCell>Sold</HeaderCell>
					<Cell dataKey='totalQuantity' />
				</Column>

				<Column fixed verticalAlign='middle'>
					<HeaderCell>In stock</HeaderCell>
					<Cell dataKey='count' />
				</Column>

				{/* <Column flexGrow={1} fixed verticalAlign='middle'>
					<HeaderCell>Sell price</HeaderCell>
					<Cell>
						{rowData => `GHS ${roundMoney(rowData.price * rate)}`}
					</Cell>
				</Column> */}
			</Table>
		</Panel>
	)
}
export default TopSellersCard
