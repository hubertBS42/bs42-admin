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
	createCurrency,
	updateCurrency,
} from '@/redux/features/currencies/currenciesActions'

import {
	getDrawerData,
	getDrawerLoadingState,
	getDrawerOpenState,
	getEditState,
	setDrawerClose,
} from '@/redux/features/drawer/drawerSlice'
import { countries } from '@/utils/data'

const { StringType, NumberType } = Schema.Types

const model = Schema.Model({
	name: StringType().isRequired(
		"You must provide the currency's name."
	),
	country: StringType().isRequired(
		"You must provide the currency's country."
	),
	symbol: StringType().isRequired(
		"You must provide the currency's symbol."
	),
	abbreviation: StringType().isRequired(
		"You must provide the currency's abbreviation."
	),
	customRate: NumberType(),
})

const CurrenciesDrawer = () => {
	const dispatch = useDispatch()
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [formValue, setFormValue] = useState({
		name: '',
		country: '',
		symbol: '',
		abbreviation: '',
		customRate: '',
		isCustomRate: false,
		isActive: false,
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isEditing = useSelector(getEditState)
	const isLoading = useSelector(getDrawerLoadingState)
	const currency = useSelector(getDrawerData)

	const formattedCountries = countries.map(country => {
		return { label: country.name, value: country.name }
	})

	const updateForm = currency => {
		if (isEditing) {
			setFormValue(prev => {
				return {
					...prev,
					name: currency.name,
					country: currency.country,
					symbol: currency.symbol,
					abbreviation: currency.abbreviation,
					customRate: currency.customRate,
					isCustomRate: currency.isCustomRate,
					isActive: currency.isActive,
				}
			})
		} else {
			setFormValue({
				name: '',
				country: '',
				symbol: '',
				abbreviation: '',
				customRate: '',
				isCustomRate: false,
				isActive: false,
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
			await updateCurrency(currency, formValue)
		} else {
			//create
			await createCurrency(formValue)
		}
	}

	return (
		<Drawer
			open={isOpen}
			onClose={() => dispatch(setDrawerClose())}
			onEnter={() => updateForm(currency)}
			backdrop='static'
		>
			<Drawer.Header style={{ paddingRight: '1.2em' }}>
				<Drawer.Title>{isEditing ? 'Edit' : 'Add'} Currency</Drawer.Title>
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
					<CustomToggle
						accepter={Toggle}
						name='isActive'
						label='Active'
						disabled={currency?.isActive}
					/>

					<Panel
						header='General Information'
						bordered
						style={{ marginBottom: '1.5em' }}
					>
						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='name'
									label='Name'
									accepter={Input}
									error={formError.name}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='country'
									label='Country'
									accepter={InputPicker}
									error={formError.country}
									data={formattedCountries}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='symbol'
									label='Symbol'
									accepter={Input}
									error={formError.symbol}
								/>
							</Col>
						</Row>

						<Row>
							<Col xs={24}>
								<Field
									name='abbreviation'
									label='Abbreviation'
									accepter={Input}
									error={formError.abbreviation}
								/>
							</Col>
						</Row>
					</Panel>

					<Panel
						header={
							<Stack justifyContent='space-between'>
								<span>Custom Rate</span>
								<CustomToggle
									accepter={Toggle}
									name='isCustomRate'
									label='Custom'
								/>
							</Stack>
						}
						bordered
					>
						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='customRate'
									label='Rate'
									accepter={InputNumber}
									error={formError.customRate}
									disabled={!formValue.isCustomRate}
								/>
							</Col>
						</Row>
					</Panel>
				</Form>
			</Drawer.Body>
		</Drawer>
	)
}
export default CurrenciesDrawer
