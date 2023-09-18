'use client'
import {
	Button,
	Col,
	Form,
	Grid,
	InputNumber,
	Panel,
	Row,
	Schema,
} from 'rsuite'
import CheckIcon from '@rsuite/icons/Check'
import { useRef, useState } from 'react'
import Field from '../Field/Field'
import { useSelector } from 'react-redux'
import { getLoadingState } from '@/redux/features/rates/ratesSlice'
import {
	createRate,
	updateRate,
} from '@/redux/features/rates/ratesActions'

const { NumberType } = Schema.Types

const model = Schema.Model({
	rate: NumberType().isRequired(
		'You will need to provide the current rate.'
	),
})

const RateForm = ({ rates }) => {
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const loading = useSelector(getLoadingState)

	const [formValue, setFormValue] = useState({
		rate: rates[0]?.value,
	})

	const handleSubmit = async () => {
		if (!formRef.current.check()) {
			return
		}

		if (rates.length > 0) {
			// update
			updateRate(rates[0], formValue)
		} else {
			// add
			createRate(formValue)
		}
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
			<Grid fluid>
				<Row>
					<Col xs={24}>
						<Panel header='Dollar to Cedi Exchange Rate' bordered>
							<Row style={{ marginBottom: '1em' }}>
								<Col xs={8}>
									<Field
										name='rate'
										label='Exchange Rate'
										accepter={InputNumber}
										error={formError.rate}
										min={1}
									/>
								</Col>
							</Row>

							<Row>
								<Col>
									<Button
										onClick={handleSubmit}
										appearance='primary'
										startIcon={<CheckIcon />}
										loading={loading}
										disabled={loading}
									>
										Save
									</Button>
								</Col>
							</Row>
						</Panel>
					</Col>
				</Row>
			</Grid>
		</Form>
	)
}
export default RateForm
