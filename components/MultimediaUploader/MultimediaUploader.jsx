'use client'

import React from 'react'
import { Form, Notification, Uploader } from 'rsuite'
import CameraRetroIcon from '@rsuite/icons/legacy/CameraRetro'
import { getVideoThumbnail } from '@/utils/functions'

// eslint-disable-next-line react/display-name
const MultimediaUploader = React.forwardRef((props, ref) => {
	const {
		name,
		message,
		label,
		project,
		setFormValue,
		grabRemovedMedia,
		error,
		...rest
	} = props

	const handleChange = async fileList => {
		const updatedFileList = await Promise.all(
			fileList.map(async file => {
				if (file.blobFile?.type.startsWith('video')) {
					try {
						const thumbnail = await getVideoThumbnail(file.blobFile)
						file.url = thumbnail
						delete file.fileKey
					} catch (error) {
						Notification.error({
							title: 'Error',
							description: 'Failed to generate video thumbnail.',
						})
					}
				}
				return file
			})
		)
		setFormValue(prev => {
			return { ...prev, media: updatedFileList }
		})
	}

	const handleRemove = file => {
		const source = project.media.find(item => {
			if (
				item.thumbnail.name === file.name ||
				item.content.name === file.name
			) {
				return item
			}
		})

		grabRemovedMedia(source)
	}

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
				listType='picture'
				action='//jsonplaceholder.typicode.com/posts/'
				multiple
				accept='video/*, image/jpeg, image/png'
				autoUpload={false}
				onChange={handleChange}
				onRemove={handleRemove}
				{...rest}
			>
				<div>
					<CameraRetroIcon />
				</div>
			</Form.Control>
		</Form.Group>
	)
})
export default MultimediaUploader
