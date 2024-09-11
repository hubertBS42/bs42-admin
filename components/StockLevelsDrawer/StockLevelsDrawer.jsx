import { useRef, useState } from 'react'
import {
	Button,
	Cascader,
	Col,
	Drawer,
	Form,
	Input,
	InputNumber,
	InputPicker,
	Panel,
	Row,
	Schema,
} from 'rsuite'
import CloseIcon from '@rsuite/icons/Close'
import CheckIcon from '@rsuite/icons/Check'
import Field from '../Field/Field'
import { useDispatch, useSelector } from 'react-redux'

import {
	getDrawerData,
	getDrawerLoadingState,
	getDrawerOpenState,
	getEditState,
	setDrawerClose,
} from '@/redux/features/drawer/drawerSlice'
import {
	selectAllLocations,
	selectCurrLocation,
	selectAllProducts,
	selectAllStockLevels,
	getStorage,
} from '@/redux/features/stockLevels/stockLevelsSlice'
import {
	addStockLevel,
	updateStockLevel,
} from '@/redux/features/stockLevels/stockLevelsActions'
import { formatForTreePicker } from '@/utils/functions'

const { StringType, NumberType } = Schema.Types

const model = Schema.Model({
	product: StringType().isRequired('You must select a product.'),
	sku: StringType(),
	count: NumberType().isRequired(
		"You must provide the product's stock count."
	),
	min: NumberType().isRequired(
		'You must provide a stock count minimum.'
	),
	storage: StringType().isRequired(
		'You must select a storage location.'
	),
})

const StockLevelsDrawer = () => {
	const dispatch = useDispatch()
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [formValue, setFormValue] = useState({
		location: '',
		product: '',
		storage: '',
		sku: '',
		count: 1,
		min: 1,
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isEditing = useSelector(getEditState)
	const isLoading = useSelector(getDrawerLoadingState)
	const stockLevel = useSelector(getDrawerData)
	const availableProducts = useSelector(selectAllProducts)
	const allStockLevels = useSelector(selectAllStockLevels)
	const locations = useSelector(selectAllLocations)
	const currentLocation = useSelector(selectCurrLocation)
	let storage = useSelector(getStorage)
	storage = formatForTreePicker(storage)

	const data = isEditing ? allStockLevels : availableProducts
	const formatted = data.map(product => ({
		label: product.title,
		value: product._id,
	}))

	const location = locations.find(
		location => location._id === currentLocation
	)?.name

	const updateForm = stockLevel => {
		setFormError({})
		if (isEditing) {
			setFormValue(prev => {
				return {
					...prev,
					location: stockLevel.location._id,
					product: stockLevel.product._id,
					storage: stockLevel.storage,
					sku: stockLevel.sku,
					count: stockLevel.count,
					min: stockLevel.min,
				}
			})
		} else {
			setFormValue({
				location: currentLocation,
				product: '',
				storage: currentLocation,
				sku: '',
				count: 1,
				min: 1,
			})
		}

		return
	}

	const handleSubmit = async () => {
		if (!formRef.current.check()) {
			return
		}

		if (isEditing) {
			//update
			await updateStockLevel(stockLevel, formValue)
		} else {
			//create
			await addStockLevel(formValue)
		}
	}

	return (
		<Drawer
			open={isOpen}
			onClose={() => dispatch(setDrawerClose())}
			onEnter={() => updateForm(stockLevel)}
			backdrop='static'
		>
			<Drawer.Header style={{ paddingRight: '1.2em' }}>
				<Drawer.Title>
					{isEditing ? 'Edit item at' : 'Add item to'} {location}
				</Drawer.Title>
				<Drawer.Actions>
					<Button
						onClick={() => dispatch(setDrawerClose())}
						startIcon={<CloseIcon />}
						disabled={isLoading}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						appearance='primary'
						startIcon={<CheckIcon />}
						disabled={isLoading}
						loading={isLoading}
					>
						Save
					</Button>
				</Drawer.Actions>
			</Drawer.Header>
			<Drawer.Body style={{ padding: '1.2em' }}>
				<Form
					ref={formRef}
					onChange={setFormValue}
					onCheck={setFormError}
					formValue={formValue}
					model={model}
					disabled={isLoading}
				>
					{/* <CustomToggle
							accepter={Toggle}
							name='isActive'
							label='Active'
						/> */}

					<Panel bordered>
						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='product'
									label='Product'
									accepter={InputPicker}
									data={formatted}
									error={formError.product}
									readOnly={isEditing}
								/>
							</Col>
						</Row>
						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='sku'
									label='SKU'
									accepter={Input}
									error={formError.sku}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={12}>
								<Field
									name='count'
									label='Stock count'
									accepter={InputNumber}
									error={formError.count}
									min={0}
									onChange={value =>
										setFormValue(prev => ({ ...prev, count: Number(value) }))
									}
								/>
							</Col>
							<Col xs={12}>
								<Field
									name='min'
									label='Min stock count'
									accepter={InputNumber}
									error={formError.min}
									min={0}
									onChange={value =>
										setFormValue(prev => ({ ...prev, min: Number(value) }))
									}
								/>
							</Col>
							{/* <Col xs={12}>
								<Field
									name='max'
									label='Max stock count'
									accepter={InputNumber}
									error={formError.max}
									min={0}
									onChange={value =>
										setFormValue(prev => ({ ...prev, max: Number(value) }))
									}
								/>
							</Col> */}
						</Row>

						<Row>
							<Col xs={24}>
								{storage && (
									<Field
										name='storage'
										label='Storage'
										accepter={Cascader}
										error={formError.storage}
										parentSelectable
										block
										data={storage}
										cleanable={false}
									/>
								)}
							</Col>
						</Row>
					</Panel>
				</Form>
			</Drawer.Body>
		</Drawer>
	)
}
export default StockLevelsDrawer
