'use client'
import CustomToggle from '@/components/CustomToggle/CustomToggle'
import {
	Button,
	Col,
	Form,
	InputNumber,
	Panel,
	Row,
	Schema,
	SelectPicker,
	Stack,
	Toggle,
} from 'rsuite'
import HistoryIcon from '@rsuite/icons/History'
import Field from '@/components/Field/Field'
import { useRef, useState } from 'react'

const { StringType } = Schema.Types

const model = Schema.Model({
	currency: StringType().isRequired('You must select a currency.'),
	currentRate: StringType(),
})

const CurrencyPage = () => {
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [formValue, setFormValue] = useState({
		currency: '',
		currentRate: '',
	})
	const isLoading = false
	return (
		<Form
			ref={formRef}
			onChange={setFormValue}
			onCheck={setFormError}
			formValue={formValue}
			model={model}
			fluid
			disabled={isLoading}
		>
			<Panel
				header={
					<Stack justifyContent='space-between'>
						<span>Exchange Rate</span>
						<div style={{ width: '120px' }}>
							<CustomToggle
								accepter={Toggle}
								name='manualOverride'
								label='Manual'
								// onChange={handleChange}
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
							// error={formError.currency}
							// data={formattedCurrencies}
							// readOnly
						/>
					</Col>
				</Row>
				<Row style={{ marginBottom: 15 }}>
					<Col xs={22}>
						<Field
							name='currentRate'
							label='Current Rate'
							accepter={InputNumber}
							// error={formError.currentRate}
							// readOnly={!formValue.manualOverride}
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
		</Form>
	)
}
export default CurrencyPage
