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
		cardImageList,
		label,
		grabRemovedMedia,
		message,
		error,
		...rest
	} = props

	const [fileInfo, setFileInfo] = useState(null)
	useEffect(() => {
		const latestFile = cardImageList[cardImageList.length - 1]
		if (latestFile) {
			if (latestFile.hasOwnProperty('blobFile')) {
				console.log(latestFile)
				console.log('single ran')
				if (oldCardImage) {
					grabRemovedMedia({ type: 'image', ...oldCardImage })
				}

				previewFile(latestFile.blobFile, value => {
					setFileInfo(value)
				})
			} else {
				setFileInfo(latestFile.url)
			}
		}
	}, [cardImageList])
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
