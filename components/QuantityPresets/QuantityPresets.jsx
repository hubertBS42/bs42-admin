'use client'

import {
	Col,
	IconButton,
	InputNumber,
	List,
	Row,
	Stack,
} from 'rsuite'
import TrashIcon from '@rsuite/icons/Trash'
import PlusIcon from '@rsuite/icons/Plus'
import { nanoid } from '@reduxjs/toolkit'

const QuantityPresets = ({ data, setFormValue }) => {
	const handleClick = () => {
		const index = nanoid()
		setFormValue(prev => {
			return {
				...prev,
				quantityPresets: [
					...data,
					{ min: 0, max: 0, price: 0, resellerPrice: 0, index },
				],
			}
		})
	}

	const handleDelete = index => {
		const filtered = data.filter(preset => preset.index !== index)
		setFormValue(prev => {
			return { ...prev, quantityPresets: filtered }
		})
	}

	const handleChange = (value, index, name) => {
		const newData = data.map(preset => {
			if (preset.index === index) {
				return {
					...preset,
					[name]: Number(value),
				}
			}
			return preset
		})

		setFormValue(prev => {
			return { ...prev, quantityPresets: newData }
		})
	}

	return (
		<>
			<Stack style={{ marginBottom: 8 }}>
				<span style={{ fontSize: 13 }}>Quantity Presets</span>
			</Stack>
			<List bordered>
				<List.Item>
					<Row style={{ fontSize: 12 }}>
						<Col xs={5} style={{ opacity: '.8' }}>
							Min
						</Col>
						<Col xs={5} style={{ opacity: '.8' }}>
							Max
						</Col>
						<Col xs={6} style={{ opacity: '.8' }}>
							Sell Price
						</Col>
						<Col xs={6} style={{ opacity: '.8' }}>
							Reseller Price
						</Col>
						<Col xs={2} style={{ textAlign: 'center' }}>
							<IconButton
								icon={<PlusIcon />}
								circle
								size='xs'
								appearance='primary'
								onClick={handleClick}
							/>
						</Col>
					</Row>
				</List.Item>
				{data?.map(preset => (
					<List.Item key={preset.index}>
						<Row style={{ fontSize: 12 }}>
							<Col xs={5}>
								<InputNumber
									name='min'
									min={0}
									defaultValue={preset.min}
									onChange={(val, e) => handleChange(val, preset.index, 'min')}
									size='sm'
								/>
							</Col>
							<Col xs={5}>
								<InputNumber
									name='max'
									min={0}
									defaultValue={preset.max}
									onChange={(val, e) => handleChange(val, preset.index, 'max')}
									size='sm'
								/>
							</Col>
							<Col xs={6}>
								<InputNumber
									name='price'
									min={0}
									defaultValue={preset.price}
									onChange={(val, e) =>
										handleChange(val, preset.index, 'price')
									}
									prefix='$'
									size='sm'
								/>
							</Col>
							<Col xs={6}>
								<InputNumber
									name='resellerPrice'
									min={0}
									defaultValue={preset.resellerPrice}
									onChange={(val, e) =>
										handleChange(val, preset.index, 'resellerPrice')
									}
									prefix='$'
									size='sm'
								/>
							</Col>
							<Col
								xs={2}
								style={{
									textAlign: 'center',
								}}
							>
								<IconButton
									icon={<TrashIcon />}
									circle
									size='xs'
									appearance='primary'
									color='red'
									onClick={() => handleDelete(preset.index)}
									disabled={data.length === 1}
									style={{ marginTop: 4 }}
								/>
							</Col>
						</Row>
					</List.Item>
				))}
			</List>
		</>
	)
}
export default QuantityPresets
