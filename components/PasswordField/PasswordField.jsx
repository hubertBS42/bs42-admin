'use client'
import React, { useState } from 'react'
import { Form, InputGroup } from 'rsuite'
import EyeIcon from '@rsuite/icons/legacy/Eye'
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash'

// eslint-disable-next-line react/display-name
const PasswordField = React.forwardRef((props, ref) => {
	const { name, message, label, accepter, error, size, ...rest } =
		props

	const [visible, setVisible] = useState(false)

	const handleChange = () => {
		setVisible(!visible)
	}

	return (
		<Form.Group
			controlId={name}
			ref={ref}
			className={error ? 'has-error' : ''}
		>
			<Form.ControlLabel>{label}</Form.ControlLabel>
			<InputGroup inside>
				<Form.Control
					type={visible ? 'text' : 'password'}
					name={name}
					accepter={accepter}
					errorMessage={error}
					autoComplete='off'
					style={{ width: '100%' }}
					size={size}
				/>
				<InputGroup.Button
					onClick={handleChange}
					style={{ padding: size && '20px 15px' }}
				>
					{visible ? <EyeIcon /> : <EyeSlashIcon />}
				</InputGroup.Button>
			</InputGroup>
			{message && <Form.HelpText>{message}</Form.HelpText>}
		</Form.Group>
	)
})
export default PasswordField
