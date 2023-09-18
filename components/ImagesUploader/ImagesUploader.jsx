'use client'

import React from 'react'
import { Form } from 'rsuite'
import CameraRetroIcon from '@rsuite/icons/legacy/CameraRetro'

// eslint-disable-next-line react/display-name
const ImagesUploader = React.forwardRef((props, ref) => {
	const {
		name,
		message,
		accepter,
		label,
		maxImages,
		noOfImages,
		error,
		...rest
	} = props

	return (
		<Form.Group
			controlId={name}
			ref={ref}
			className={error ? 'has-error' : ''}
		>
			<Form.ControlLabel>
				{label} ({noOfImages}/{maxImages})
			</Form.ControlLabel>
			<Form.Control
				name={name}
				accepter={accepter}
				errorMessage={error}
				style={{ width: '100%' }}
				{...rest}
			>
				<button>
					<CameraRetroIcon />
				</button>
			</Form.Control>
			<Form.HelpText>{message}</Form.HelpText>
		</Form.Group>
	)
})
export default ImagesUploader
