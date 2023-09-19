'use client'

import {
	Button,
	Col,
	Form,
	Grid,
	Input,
	InputNumber,
	Panel,
	Row,
	Schema,
	SelectPicker,
	Stack,
	Toggle,
} from 'rsuite'
import CheckIcon from '@rsuite/icons/Check'
import HistoryIcon from '@rsuite/icons/History'
import { useRef, useState } from 'react'
import CustomToggle from '../CustomToggle/CustomToggle'
import Field from '../Field/Field'
import { fetcher } from '@/utils/functions'
import { toast } from 'react-toastify'

const { StringType, ArrayType, NumberType } = Schema.Types

const model = Schema.Model({
	currency: StringType().isRequired(
		'You will need to select a currency.'
	),
	currentRate: NumberType().isRequired(
		'You will need to provide a rate.'
	),
})

const SettingsForm = ({ data }) => {
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [loading, setLoading] = useState(false)
	const [formValue, setFormValue] = useState({
		carouselSlides: data.settings[0]?.carouselSlides || [],
		currency: data.settings[0]?.exchangeRate?.currency._id,
		currentRate: data.settings[0]?.exchangeRate?.currentRate || 1,
		manualOverride:
			data.settings[0]?.exchangeRate?.manualOverride || false,
	})

	const currencies = data.currencies.map(currency => ({
		label: currency.name + ' ' + currency.symbol,
		value: currency._id,
	}))

	const handleSubmit = async () => {
		if (!formRef.current.check()) {
			return
		}

		setLoading(true)

		const preparedData = {
			carouselSlides: formValue.carouselSlides,
			exchangeRate: {
				currency: formValue.currency,
				currentRate: Number(formValue.currentRate),
				manualOverride: formValue.manualOverride,
			},
		}

		const { status, message } = await fetcher('/api/settings/add', {
			method: 'POST',
			body: JSON.stringify(preparedData),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		})
		setLoading(false)

		if (status === 'success') {
			toast.success('Settings were updated successfully.')
			return
		}
		console.log(message)
		toast.error('Failed to to update settings.')
	}
	return (
		<Form
			ref={formRef}
			onChange={setFormValue}
			onCheck={setFormError}
			formValue={formValue}
			model={model}
			fluid
			disabled={loading}
		>
			<Stack direction='column' alignItems='stretch' spacing={20}>
				<Stack justifyContent='flex-end'>
					<Button
						onClick={handleSubmit}
						appearance='primary'
						startIcon={<CheckIcon />}
						loading={loading}
						disabled={loading}
					>
						Save
					</Button>
				</Stack>

				<Panel header='Homepage Carousel' bordered></Panel>

				<Panel
					header={
						<Stack justifyContent='space-between'>
							<span>Exchange Rate</span>
							<div style={{ width: '120px' }}>
								<CustomToggle
									accepter={Toggle}
									name='manualOverride'
									label='Manual'
								/>
							</div>
						</Stack>
					}
					bordered
				>
					<Row style={{ marginBottom: 25 }}>
						<Col xs={24}>
							<Field
								name='currency'
								label='Currency'
								accepter={SelectPicker}
								error={formError.currency}
								data={currencies}
							/>
						</Col>
					</Row>
					<Row style={{ marginBottom: 15 }}>
						<Col xs={22}>
							<Field
								name='currentRate'
								label='Current Rate'
								accepter={InputNumber}
								error={formError.currentRate}
								disabled={!formValue.manualOverride}
							/>
						</Col>
						<Col xs={2}>
							<Button
								appearance='primary'
								size='md'
								style={{ marginTop: 22 }}
								block
							>
								<HistoryIcon />
							</Button>
						</Col>
					</Row>
				</Panel>
			</Stack>
		</Form>
	)
}
export default SettingsForm
