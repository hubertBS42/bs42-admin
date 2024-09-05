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
	createCategory,
	updateCategory,
} from '@/redux/features/categories/categoriesActions'

import {
	getDrawerData,
	getDrawerLoadingState,
	getDrawerOpenState,
	getEditState,
	setDrawerClose,
} from '@/redux/features/drawer/drawerSlice'

import {
	formatForTreePicker,
	getDisabledItems,
} from '@/utils/functions'
import { selectAllCategories } from '@/redux/features/categories/categoriesSlice'
import ImagesUploader from '../ImagesUploader/ImagesUploader'
import TextArea from '../TextArea/TextArea'
import CustomTreePicker from '../CustomTreePicker/CustomTreePicker'

const { StringType, ArrayType } = Schema.Types

const model = Schema.Model({
	name: StringType().isRequired('You must provide a name.'),
	parent: StringType(),
	description: StringType(),
	// images: ArrayType().minLength(
	// 	1,
	// 	'You need to upload at least 1 image.'
	// ),
})

const CategoriesDrawer = () => {
	const dispatch = useDispatch()
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [imagesToBeDeleted, setImagesToBeDeleted] = useState([])
	const [formValue, setFormValue] = useState({
		name: '',
		parent: null,
		description: '',
		images: [],
		isActive: true,
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isEditing = useSelector(getEditState)
	const isLoading = useSelector(getDrawerLoadingState)
	const category = useSelector(getDrawerData)
	const categories = useSelector(selectAllCategories)
	const [disabledCategories, setDisabledCategories] = useState([])

	let formattedCategories = formatForTreePicker(categories)

	formattedCategories.unshift({
		key: '0',
		label: '- No Parent -',
		value: null,
	})

	const updateForm = category => {
		if (isEditing) {
			setFormError({})
			const data = getDisabledItems(categories, category.id)

			setDisabledCategories(data)

			setFormValue(prev => {
				return {
					...prev,
					name: category.name,
					parent: category.parent || null,
					description: category.description,
					images: category.images,
					isActive: category.isActive,
				}
			})
		} else {
			setDisabledCategories([])
			setFormValue({
				name: '',
				parent: null,
				description: '',
				images: [],
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

			await updateCategory(category, formValue, imagesToBeDeleted)
			setImagesToBeDeleted([])
		} else {
			//create
			await createCategory(formValue)
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
			onEnter={() => updateForm(category)}
			backdrop='static'
		>
			<Drawer.Header style={{ paddingRight: '1.2em' }}>
				<Drawer.Title>{isEditing ? 'Edit' : 'Add'} Category</Drawer.Title>
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
									name='parent'
									label='Parent'
									defaultExpandAll
									accepter={CustomTreePicker}
									error={formError.parent}
									data={formattedCategories}
									disabledItemValues={disabledCategories}
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
									name='images'
									accepter={Uploader}
									error={formError.images}
									multiple
									listType='picture'
									action='//jsonplaceholder.typicode.com/posts/'
									defaultFileList={category?.images}
									autoUpload={false}
									label='Images'
									maxImages={6}
									noOfImages={formValue.images.length}
									disabled={formValue.images.length === 6}
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
export default CategoriesDrawer
