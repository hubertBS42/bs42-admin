import { useRef, useState } from 'react'
import {
	Button,
	Col,
	Drawer,
	Form,
	Input,
	InputNumber,
	InputPicker,
	Panel,
	Row,
	Schema,
	Stack,
	Toggle,
} from 'rsuite'
import CloseIcon from '@rsuite/icons/Close'
import CheckIcon from '@rsuite/icons/Check'
import CustomToggle from '../CustomToggle/CustomToggle'
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
	selectAllInventory,
} from '@/redux/features/inventory/inventorySlice'
import {
	addInventory,
	updateInventory,
} from '@/redux/features/inventory/inventoryActions'

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
	max: NumberType().isRequired(
		'You must provide a stock count maximum.'
	),
})

const InventoryDrawer = () => {
	const dispatch = useDispatch()
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [formValue, setFormValue] = useState({
		location: '',
		product: '',
		sku: '',
		count: 1,
		min: 1,
		max: 1,
		unitsSold: 0,
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isEditing = useSelector(getEditState)
	const isLoading = useSelector(getDrawerLoadingState)
	const inventory = useSelector(getDrawerData)
	const availableProducts = useSelector(selectAllProducts)
	const allInventory = useSelector(selectAllInventory)
	const locations = useSelector(selectAllLocations)
	const currentLocation = useSelector(selectCurrLocation)

	const data = isEditing ? allInventory : availableProducts
	const formatted = data.map(product => ({
		label: product.title,
		value: product._id,
	}))

	const location = locations.find(
		location => location._id === currentLocation
	)?.name

	const updateForm = inventory => {
		if (isEditing) {
			setFormValue(prev => {
				return {
					...prev,
					location: inventory.location._id,
					product: inventory.product._id,
					sku: inventory.sku,
					count: inventory.count,
					min: inventory.min,
					max: inventory.max,
					unitsSold: inventory.unitsSold,
				}
			})
		} else {
			setFormValue({
				location: currentLocation,
				product: '',
				sku: '',
				count: 1,
				min: 1,
				max: 1,
				unitsSold: 0,
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
			await updateInventory(inventory, formValue)
		} else {
			//create
			await addInventory(formValue)
		}
	}

	return (
		<Drawer
			open={isOpen}
			onClose={() => dispatch(setDrawerClose())}
			onEnter={() => updateForm(inventory)}
			backdrop='static'
		>
			<Drawer.Header style={{ paddingRight: '1.2em' }}>
				<Drawer.Title>
					{isEditing ? 'Edit' : 'Add'} Item to {location}
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
							<Col xs={12}>
								<Field
									name='sku'
									label='SKU'
									accepter={Input}
									error={formError.sku}
								/>
							</Col>
							<Col xs={12}>
								<Field
									name='count'
									label='Stock count'
									accepter={InputNumber}
									error={formError.count}
									min={1}
									onChange={value =>
										setFormValue(prev => ({ ...prev, count: Number(value) }))
									}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={12}>
								<Field
									name='min'
									label='Min stock count'
									accepter={InputNumber}
									error={formError.min}
									min={1}
									onChange={value =>
										setFormValue(prev => ({ ...prev, min: Number(value) }))
									}
								/>
							</Col>
							<Col xs={12}>
								<Field
									name='max'
									label='Max stock count'
									accepter={InputNumber}
									error={formError.max}
									min={1}
									onChange={value =>
										setFormValue(prev => ({ ...prev, max: Number(value) }))
									}
								/>
							</Col>
						</Row>
					</Panel>
				</Form>
			</Drawer.Body>
		</Drawer>
	)
}
export default InventoryDrawer
