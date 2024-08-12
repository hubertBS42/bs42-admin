'use client'

import Image from 'next/image'
import { forwardRef, useEffect, useState } from 'react'
import { Form, Uploader } from 'rsuite'
import CameraRetroIcon from '@rsuite/icons/legacy/CameraRetro'

function previewFile(file, callback) {
	const reader = new FileReader()
	reader.onloadend = () => {
		callback(reader.result)
	}
	reader.readAsDataURL(file)
}

// eslint-disable-next-line react/display-name
const SingleImageUploader = forwardRef((props, ref) => {
	const {
		name,
		oldCardImage,
		label,
		grabRemovedMedia,
		message,
		error,
		...rest
	} = props

	const [fileInfo, setFileInfo] = useState(null)
	const [deleteCardImg, setDeleteCardImg] = useState(false)

	const handleChange = fileList => {
		const latestFile = fileList[fileList.length - 1]

		previewFile(latestFile.blobFile, value => {
			setFileInfo(value)
		})

		if (oldCardImage && !deleteCardImg) {
			grabRemovedMedia({ type: 'image', ...oldCardImage })
			setDeleteCardImg(true)
		}
	}

	useEffect(() => {
		if (oldCardImage) {
			setFileInfo(oldCardImage.url)
		}
	}, [])

	return (
		<Form.Group
			controlId={name}
			ref={ref}
			className={error ? 'has-error full-width' : 'full-width'}
		>
			<Form.ControlLabel>{label}</Form.ControlLabel>
			<Form.Control
				name={name}
				accepter={Uploader}
				errorMessage={error}
				fileListVisible={false}
				listType='picture-text'
				action='//jsonplaceholder.typicode.com/posts/'
				autoUpload={false}
				accept='image/jpeg, image/png'
				onChange={handleChange}
				{...rest}
			>
				<div
					style={{
						// width: '100%',
						height: 200,
						background: 'transparent',
						position: 'relative',
						overflow: 'hidden',
						borderRadius: 6,
						border: '1px dashed gray',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						cursor: 'pointer',
					}}
				>
					{fileInfo ? (
						<Image
							src={fileInfo}
							alt='Card image'
							style={{ objectFit: 'cover' }}
							fill
						/>
					) : (
						<CameraRetroIcon style={{ fontSize: 80 }} />
					)}
				</div>
			</Form.Control>
			{message && <Form.HelpText>{message}</Form.HelpText>}
		</Form.Group>
	)
})
export default SingleImageUploader
