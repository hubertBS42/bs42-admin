'use client'
import { useRef, useState } from 'react'
import {
	Button,
	Col,
	DatePicker,
	Drawer,
	Form,
	Input,
	InputPicker,
	Panel,
	Row,
	Schema,
	SelectPicker,
	Stack,
	Toggle,
	Uploader,
} from 'rsuite'
import CloseIcon from '@rsuite/icons/Close'
import CheckIcon from '@rsuite/icons/Check'
import CustomToggle from '../CustomToggle/CustomToggle'
import Field from '../Field/Field'
import { useDispatch, useSelector } from 'react-redux'

// import {
// 	createSlide,
// 	updateSlide,
// } from '@/redux/features/slides/slidesActions'

import {
	getDrawerData,
	getDrawerLoadingState,
	getDrawerOpenState,
	getEditState,
	setDrawerClose,
} from '@/redux/features/drawer/drawerSlice'

import ImagesUploader from '../ImagesUploader/ImagesUploader'
import TextArea from '../TextArea/TextArea'
import { useLocation } from '@/hooks/useLocation'
import ProjectCardImageUploader from '../ProjectCardImageUploader/ProjectCardImageUploader'
import SingleImageUploader from '../SingleImageUploader/SingleImageUploader'
import MultimediaUploader from '../MultimediaUploader/MultimediaUploader'
import {
	createProject,
	updateProject,
} from '@/redux/features/projects/projectsActions'

const { StringType, ArrayType, DateType } = Schema.Types

const model = Schema.Model({
	cardImg: ArrayType().minLength(
		1,
		'You must provide an image for the card.'
	),
	title: StringType().isRequired('You must provide a title.'),
	town: StringType().isRequired('You must provide an town.'),
	region: StringType().isRequired('You must provide a region.'),
	date: DateType().isRequired('You must provide a date.'),
	media: ArrayType().minLength(
		1,
		'You need to upload at least 1 image or video.'
	),
})

// const posData = []

// for (let index = 0; index < 100; index++) {
// 	posData.push({ label: index, value: index })
// }

const ProjectsDrawer = () => {
	const dispatch = useDispatch()
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [mediaToBeDeleted, setMediaToBeDeleted] = useState([])
	const [formValue, setFormValue] = useState({
		title: '',
		region: '',
		town: '',
		cardImg: [],
		date: new Date(),
		media: [],
		isCompleted: false,
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isEditing = useSelector(getEditState)
	const isLoading = useSelector(getDrawerLoadingState)
	const project = useSelector(getDrawerData)
	const [regions, towns, handleRegion, clearTowns] = useLocation()

	const updateForm = project => {
		if (isEditing) {
			setFormValue(prev => {
				return {
					...prev,
					title: project.title,
					region: project.region,
					town: project.town,
					cardImg: [project.cardImg],
					date: new Date(project.date),
					media: project.media,
					isCompleted: project.isCompleted,
				}
			})
		} else {
			setFormValue({
				title: '',
				region: '',
				town: '',
				cardImg: [],
				date: new Date(),
				media: [],
				isCompleted: false,
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
			await updateProject(formValue, mediaToBeDeleted)
			// setMediaToBeDeleted([])
		} else {
			//add
			await createProject(formValue)
		}
	}

	const grabRemovedMedia = media => {
		setMediaToBeDeleted(prev => {
			return [...prev, media]
		})
	}

	return (
		<Drawer
			open={isOpen}
			onClose={() => dispatch(setDrawerClose())}
			onEnter={() => updateForm(project)}
			backdrop='static'
		>
			<Drawer.Header style={{ paddingRight: '1.2em' }}>
				<Drawer.Title>{isEditing ? 'Edit' : 'Add'} Project</Drawer.Title>
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
					fluid
				>
					<Panel bordered>
						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={12}>
								<Field
									name='isCompleted'
									label='Completed'
									accepter={SelectPicker}
									searchable={false}
									data={[
										{ label: 'Ongoing', value: false },
										{ label: 'Completed', value: true },
									]}
									error={formError.isCompleted}
								/>
							</Col>
							<Col xs={12}>
								<Field
									accepter={DatePicker}
									label='Date'
									name='date'
									// defaultValue={new Date(formValue.date)}
									error={formError.date}
									placeholder='Select a Date'
									oneTap
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<SingleImageUploader
									name='cardImg'
									error={formError.cardImg}
									label='Card image'
									oldCardImage={project?.cardImg}
									cardImageList={formValue.cardImg}
									grabRemovedMedia={grabRemovedMedia}
								/>
							</Col>
						</Row>
						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<MultimediaUploader
									name='media'
									error={formError.media}
									project={project}
									defaultFileList={
										project ? project.media.map(item => item.thumbnail) : []
									}
									label='Media'
									setFormValue={setFormValue}
									grabRemovedMedia={grabRemovedMedia}
								/>
							</Col>
						</Row>

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
							<Col xs={12}>
								<Field
									name='region'
									label='Region'
									accepter={InputPicker}
									error={formError?.region}
									data={regions}
									onSelect={value => handleRegion(value)}
									onChange={() => {
										setFormValue(prev => {
											return {
												...prev,
												town: '',
											}
										})
									}}
									onClean={() => {
										clearTowns()
									}}
								/>
							</Col>
							<Col xs={12}>
								<Field
									name='town'
									label='Town'
									accepter={InputPicker}
									error={formError?.town}
									data={towns}
									disabled={towns.length === 0}
								/>
							</Col>
						</Row>
					</Panel>
				</Form>
			</Drawer.Body>
		</Drawer>
	)
}
export default ProjectsDrawer
