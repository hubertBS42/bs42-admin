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
	Toggle,
	Uploader,
} from 'rsuite'
import CloseIcon from '@rsuite/icons/Close'
import CheckIcon from '@rsuite/icons/Check'
import CustomToggle from '../CustomToggle/CustomToggle'
import Field from '../Field/Field'
import { useDispatch, useSelector } from 'react-redux'

import {
	createBrand,
	updateBrand,
} from '@/redux/features/brands/brandsActions'

import {
	getDrawerData,
	getDrawerLoadingState,
	getDrawerOpenState,
	getEditState,
	setDrawerClose,
} from '@/redux/features/drawer/drawerSlice'

import ImagesUploader from '../ImagesUploader/ImagesUploader'
import TextArea from '../TextArea/TextArea'

const { StringType, ArrayType } = Schema.Types

const model = Schema.Model({
	name: StringType().isRequired('You must provide a name.'),
	website: StringType()
		.isRequired("You must provide a URL to the brand's website.")
		.isURL('URL not valid.'),
	description: StringType(),
	logo: ArrayType().minLength(
		1,
		'You need to upload at least 1 image.'
	),
})

const BrandsDrawer = () => {
	const dispatch = useDispatch()
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [imagesToBeDeleted, setImagesToBeDeleted] = useState([])
	const [formValue, setFormValue] = useState({
		name: '',
		website: '',
		logo: [],
		description: '',
		isActive: true,
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isEditing = useSelector(getEditState)
	const isLoading = useSelector(getDrawerLoadingState)
	const brand = useSelector(getDrawerData)

	const updateForm = brand => {
		if (isEditing) {
			setFormValue(prev => {
				return {
					...prev,
					name: brand.name,
					website: brand.website,
					isActive: brand.isActive,
					description: brand.description,
					logo: brand.logo ? [brand.logo] : [],
				}
			})
		} else {
			setFormValue({
				name: '',
				website: '',
				logo: [],
				description: '',
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
			await updateBrand(brand, formValue, imagesToBeDeleted)
			setImagesToBeDeleted([])
		} else {
			//create
			await createBrand(formValue)
		}
	}

	const grabRemovedImages = file => {
		setImagesToBeDeleted(prev => {
			return [...prev, file.name]
		})
	}

	return (
		<Drawer
			open={isOpen}
			onClose={() => dispatch(setDrawerClose())}
			onEnter={() => updateForm(brand)}
			backdrop='static'
		>
			<Drawer.Header style={{ paddingRight: '1.2em' }}>
				<Drawer.Title>{isEditing ? 'Edit' : 'Add'} Brand</Drawer.Title>
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
						Save
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
									name='name'
									label='Name'
									accepter={Input}
									error={formError.name}
									autoFocus
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='website'
									label='Website'
									accepter={Input}
									error={formError.website}
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
						<Row>
							<Col xs={24}>
								<ImagesUploader
									name='logo'
									accepter={Uploader}
									error={formError.logo}
									multiple
									listType='picture'
									action='//jsonplaceholder.typicode.com/posts/'
									defaultFileList={isEditing && brand.logo ? [brand.logo] : []}
									autoUpload={false}
									label='Images'
									maxImages={1}
									noOfImages={formValue.logo.length}
									disabled={formValue.logo.length === 1}
									onRemove={grabRemovedImages}
								/>
							</Col>
						</Row>
					</Panel>
				</Form>
			</Drawer.Body>
		</Drawer>
	)
}
export default BrandsDrawer
