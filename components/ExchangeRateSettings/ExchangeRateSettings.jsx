import {
	Button,
	Col,
	InputNumber,
	Panel,
	Row,
	SelectPicker,
	Stack,
	Toggle,
} from 'rsuite'
import CustomToggle from '../CustomToggle/CustomToggle'
import Field from '../Field/Field'
import HistoryIcon from '@rsuite/icons/History'

const ExhangeRateSettings = ({
	currencies,
	handleChange,
	formError,
	formValue,
}) => {
	const formattedCurrencies = currencies.map(currency => ({
		label: currency.name + ' ' + currency.symbol,
		value: currency._id,
	}))

	return (
		<Panel
			header={
				<Stack justifyContent='space-between'>
					<span>Exchange Rate</span>
					<div style={{ width: '120px' }}>
						<CustomToggle
							accepter={Toggle}
							name='manualOverride'
							label='Manual'
							onChange={handleChange}
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
						data={formattedCurrencies}
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
						error={formError.currentRate}
						readOnly={!formValue.manualOverride}
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
	)
}
export default ExhangeRateSettings
