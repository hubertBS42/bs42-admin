'use client'
import React from 'react'
import { Form, InputGroup } from 'rsuite'

// eslint-disable-next-line react/display-name
const GeneratePasswordField = React.forwardRef((props, ref) => {
	const {
		name,
		message,
		label,
		accepter,
		error,
		handlePassword,
		size,
		...rest
	} = props

	return (
		<InputGroup style={{ width: '100%' }}>
			<Form.Control
				type='text'
				name={name}
				autoComplete='off'
				size={size}
			/>
			<InputGroup.Button
				onClick={handlePassword}
				style={{ padding: size && '20px 15px' }}
			>
				Generate
			</InputGroup.Button>
		</InputGroup>
	)
})
export default GeneratePasswordField
