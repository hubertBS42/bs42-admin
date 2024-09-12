'use client'
import React from 'react'
import { Button, Form, HStack, InputGroup } from 'rsuite'

// eslint-disable-next-line react/display-name
const Field = React.forwardRef((props, ref) => {
	const {
		name,
		message,
		label,
		accepter,
		type = 'text',
		handlePassword,
		error,
		...rest
	} = props

	return (
		<Form.Group
			controlId={name}
			ref={ref}
			className={error ? 'has-error full-width' : 'full-width'}
		>
			<HStack justifyContent='space-between' alignItems='center'>
				{label && <Form.ControlLabel>{label}</Form.ControlLabel>}
				{type === 'password' && (
					<Button
						appearance='link'
						style={{ fontSize: 13, padding: 0 }}
						onClick={handlePassword}
					>
						Generate
					</Button>
				)}
			</HStack>

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
export default Field
