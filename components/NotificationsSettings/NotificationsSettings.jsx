'use client'
import { Col, Panel, Row, Stack, TagPicker } from 'rsuite'
import Field from '../Field/Field'

const NotificationsSettings = () => {
	return (
		<Panel header='Notifications' bordered>
			<Row style={{ marginBottom: 25 }}>
				<Col xs={24}>
					<Field
						name='currency'
						label='Currency'
						accepter={TagPicker}
						error={formError.currency}
						data={formattedCurrencies}
						// readOnly
					/>
				</Col>
			</Row>
			<Row style={{ marginBottom: 15 }}>
				<Col xs={24}>
					{/* <Field
          name='currentRate'
          label='Current Rate'
          accepter={InputNumber}
          error={formError.currentRate}
          readOnly={!formValue.manualOverride}
        /> */}
				</Col>
			</Row>
		</Panel>
	)
}
export default NotificationsSettings
