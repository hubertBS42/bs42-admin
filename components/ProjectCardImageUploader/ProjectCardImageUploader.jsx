'use client'

import { Uploader } from 'rsuite'
import AvatarIcon from '@rsuite/icons/legacy/Avatar'
import { useState } from 'react'
import Image from 'next/image'

function previewFile(file, callback) {
	const reader = new FileReader()
	reader.onloadend = () => {
		callback(reader.result)
	}
	reader.readAsDataURL(file)
}

const ProjectCardImageUploader = () => {
	const [fileInfo, setFileInfo] = useState(null)
	return (
		<Uploader
			fileListVisible={false}
			listType='picture-text'
			action='//jsonplaceholder.typicode.com/posts/'
			autoUpload={false}
			onChange={files => {
				const latestFile = files[files.length - 1]
				previewFile(latestFile.blobFile, value => {
					setFileInfo(value)
				})
			}}
		>
			<button
				style={{
					width: '100%',
					height: 200,
					background: 'transparent',
					position: 'relative',
					overflow: 'hidden',
					borderRadius: 6,
					border: '1px dashed gray',
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
					<AvatarIcon style={{ fontSize: 80 }} />
				)}
			</button>
		</Uploader>
	)
}
export default ProjectCardImageUploader
