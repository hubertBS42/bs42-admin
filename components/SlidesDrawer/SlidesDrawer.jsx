'use client'
import { useRef, useState } from 'react'
import {
	Button,
	Col,
	Drawer,
	Form,
	Input,
	Panel,
	Row,
	Schema,
	SelectPicker,
	Toggle,
	Uploader,
} from 'rsuite'
import CloseIcon from '@rsuite/icons/Close'
import CheckIcon from '@rsuite/icons/Check'
import CustomToggle from '../CustomToggle/CustomToggle'
import Field from '../Field/Field'
import { useDispatch, useSelector } from 'react-redux'

import {
	createSlide,
	updateSlide,
} from '@/redux/features/slides/slidesActions'

import {
	getDrawerData,
	getDrawerLoadingState,
	getDrawerOpenState,
	getEditState,
	setDrawerClose,
} from '@/redux/features/drawer/drawerSlice'

import ImagesUploader from '../ImagesUploader/ImagesUploader'
import TextArea from '../TextArea/TextArea'

const { StringType, ArrayType, NumberType } = Schema.Types

const model = Schema.Model({
	title: StringType().isRequired('You must provide a title.'),
	ctaLabel: StringType().isRequired('You must provide a CTA label.'),
	ctaURL: StringType().isRequired('You must provide a CTA URL.'),
	position: NumberType().isRequired('You must provide a position.'),
	description: StringType().isRequired(
		'You must provide a description.'
	),
	image: ArrayType().minLength(
		1,
		'You need to upload at least 1 image.'
	),
})

const posData = []

for (let index = 0; index < 100; index++) {
	posData.push({ label: index, value: index })
}

const SlidesDrawer = () => {
	const dispatch = useDispatch()
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [imageToBeDeleted, setImageToBeDeleted] = useState([])
	const [formValue, setFormValue] = useState({
		title: '',
		description: '',
		ctaLabel: '',
		ctaURL: '',
		position: '',
		image: [],
		isActive: true,
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isEditing = useSelector(getEditState)
	const isLoading = useSelector(getDrawerLoadingState)
	const slide = useSelector(getDrawerData)

	const updateForm = slide => {
		if (isEditing) {
			setFormValue(prev => {
				return {
					...prev,
					title: slide.title,
					ctaLabel: slide.cta.label,
					ctaURL: slide.cta.url,
					position: slide.position,
					description: slide.description,
					image: slide.image ? [slide.image] : [],
					isActive: slide.isActive,
				}
			})
		} else {
			setFormValue({
				title: '',
				ctaLabel: '',
				ctaURL: '',
				position: '',
				description: '',
				image: [],
				isActive: true,
			})
		}

		return
	}

	const handleSubmit = async () => {
		if (!formRef.current.check()) {
			return
		}

		if (isEditing) {
			//update
			await updateSlide(slide, formValue, imageToBeDeleted)
			setImageToBeDeleted([])
		} else {
			//add
			await createSlide(formValue)
		}
	}

	const grabRemovedImage = file => {
		setImageToBeDeleted(prev => {
			return [...prev, file.name]
		})
	}

	return (
		<Drawer
			open={isOpen}
			onClose={() => dispatch(setDrawerClose())}
			onEnter={() => updateForm(slide)}
			backdrop='static'
		>
			<Drawer.Header style={{ paddingRight: '1.2em' }}>
				<Drawer.Title>{isEditing ? 'Edit' : 'Add'} Slide</Drawer.Title>
				<Drawer.Actions>
					<Button
						onClick={() => dispatch(setDrawerClose())}
						startIcon={<CloseIcon />}
						disabled={isLoading}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						appearance='primary'
						startIcon={<CheckIcon />}
						disabled={isLoading}
						loading={isLoading}
					>
						{isEditing ? 'Update' : 'Add'}
					</Button>
				</Drawer.Actions>
			</Drawer.Header>
			<Drawer.Body style={{ padding: '1.2em' }}>
				<Form
					ref={formRef}
					onChange={setFormValue}
					onCheck={setFormError}
					formValue={formValue}
					model={model}
					disabled={isLoading}
				>
					<CustomToggle accepter={Toggle} name='isActive' label='Active' />

					<Panel bordered>
						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='title'
									label='Title'
									accepter={Input}
									error={formError.title}
									autoFocus
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='description'
									label='Description'
									accepter={TextArea}
									error={formError.description}
									value={formValue.description}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='ctaLabel'
									label='CTA Label'
									accepter={Input}
									error={formError.ctaLabel}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='ctaURL'
									label='CTA URL'
									accepter={Input}
									error={formError.ctaURL}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='position'
									label='Position'
									accepter={SelectPicker}
									error={formError.position}
									searchable={false}
									data={posData}
								/>
							</Col>
						</Row>

						<Row>
							<Col xs={24}>
								<ImagesUploader
									name='image'
									accepter={Uploader}
									error={formError.image}
									multiple
									listType='picture'
									action='//jsonplaceholder.typicode.com/posts/'
									defaultFileList={
										isEditing && slide.image ? [slide.image] : []
									}
									autoUpload={false}
									label='Images'
									maxImages={1}
									noOfImages={formValue.image.length}
									disabled={formValue.image.length === 1}
									onRemove={grabRemovedImage}
								/>
							</Col>
						</Row>
					</Panel>
				</Form>
			</Drawer.Body>
		</Drawer>
	)
}
export default SlidesDrawer
