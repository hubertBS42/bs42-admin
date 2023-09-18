'use client'

import React from 'react'
import { Form } from 'rsuite'

// eslint-disable-next-line react/display-name
const CustomToggle = React.forwardRef((props, ref) => {
	const { name, message, label, accepter, error, ...rest } = props

	return (
		<Form.Group
			controlId={name}
			ref={ref}
			className={error ? 'has-error' : ''}
			style={{
				display: 'flex',
				alignItems: 'center',
			}}
		>
			<Form.Control
				name={name}
				accepter={accepter}
				errorMessage={error}
				{...rest}
			/>
			<Form.ControlLabel
				style={{
					marginBottom: '0px',
					marginLeft: '5px',
					fontWeight: '400',
					fontSize: '14px',
					width: '600px',
				}}
			>
				{label}
			</Form.ControlLabel>
			<Form.HelpText>{message}</Form.HelpText>
		</Form.Group>
	)
})
export default CustomToggle
