'use client'
import React from 'react'
import { Form } from 'rsuite'

// eslint-disable-next-line react/display-name
const OrderStatusField = React.forwardRef((props, ref) => {
	const { name, message, accepter, error, ...rest } = props

	return (
		<Form.Group
			controlId={name}
			ref={ref}
			className={error ? 'has-error full-width' : 'full-width'}
		>
			<Form.Control
				name={name}
				accepter={accepter}
				errorMessage={error}
				style={{ width: '100%' }}
				{...rest}
			/>
			{message && <Form.HelpText>{message}</Form.HelpText>}
		</Form.Group>
	)
})
export default OrderStatusField
