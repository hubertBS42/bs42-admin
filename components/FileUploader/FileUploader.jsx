'use client'

import React from 'react'
import { Form } from 'rsuite'

// eslint-disable-next-line react/display-name
const FileUploader = React.forwardRef((props, ref) => {
	const { name, message, label, accepter, error, ...rest } = props

	return (
		<Form.Group
			controlId={name}
			ref={ref}
			className={error ? 'has-error full-width' : 'full-width'}
		>
			<Form.ControlLabel>{label}</Form.ControlLabel>
			<Form.Control
				name={name}
				accepter={accepter}
				errorMessage={error}
				style={{ width: '100%' }}
				{...rest}
			>
				<div
					style={{
						height: 200,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<span>Click or Drag file here</span>
				</div>
			</Form.Control>
			<Form.HelpText>{message}</Form.HelpText>
		</Form.Group>
	)
})
export default FileUploader
