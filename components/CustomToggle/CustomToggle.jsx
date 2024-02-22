'use client'

import React from 'react'
import { Form, Input } from 'rsuite'

// eslint-disable-next-line react/display-name
const CustomToggle = React.forwardRef((props, ref) => {
	const { name, message, label, accepter, error, ...rest } = props

	return (
		<Form.Group
			controlId={name}
			ref={ref}
			className={error ? 'has-error' : ''}
		>
			<Form.ControlLabel
				style={{
					marginBottom: '0px',
					fontWeight: '400',
					fontSize: '14px',
					display: 'flex',
					alignItems: 'center',
					columnGap: '10px',
				}}
			>
				<Form.Control
					name={name}
					accepter={accepter}
					errorMessage={error}
					{...rest}
				/>
				{label}
			</Form.ControlLabel>
			<Form.HelpText>{message}</Form.HelpText>
		</Form.Group>
	)
})
export default CustomToggle
