import { useRef, useState } from 'react'
import {
	Button,
	Col,
	Drawer,
	Form,
	Input,
	InputPicker,
	Panel,
	Row,
	Schema,
	TagInput,
	Toggle,
	Uploader,
} from 'rsuite'
import CloseIcon from '@rsuite/icons/Close'
import CheckIcon from '@rsuite/icons/Check'
import CustomToggle from '../CustomToggle/CustomToggle'
import Field from '../Field/Field'
import { useDispatch, useSelector } from 'react-redux'

import {
	createBlog,
	updateBlog,
} from '@/redux/features/blogs/blogsActions'

import {
	getDrawerData,
	getDrawerLoadingState,
	getDrawerOpenState,
	getEditState,
	setDrawerClose,
} from '@/redux/features/drawer/drawerSlice'

import ImagesUploader from '../ImagesUploader/ImagesUploader'
import TextArea from '../TextArea/TextArea'
import TextEditor from '../TextEditor/TextEditor'
import { selectAllUsers } from '@/redux/features/users/usersSlice'
import { formatData } from '@/utils/functions'

const { StringType, ArrayType } = Schema.Types

const model = Schema.Model({
	title: StringType().isRequired('You must provide a title.'),
	excerpt: StringType().isRequired('You must provide an excerpt.'),
	body: StringType().isRequired('You must provide a body.'),
	author: StringType().isRequired('This field is required.'),
	previewImage: ArrayType().minLength(
		1,
		'You need to upload a preview image.'
	),
	bannerImage: ArrayType().minLength(
		1,
		'You need to upload a banner image.'
	),
	tags: ArrayType(),
})

const BlogsDrawer = () => {
	const dispatch = useDispatch()
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [imagesToBeDeleted, setImagesToBeDeleted] = useState([])
	const [formValue, setFormValue] = useState({
		title: '',
		excerpt: '',
		body: '',
		author: '',
		previewImage: [],
		bannerImage: [],
		tags: [],
		isActive: true,
	})

	let users = useSelector(selectAllUsers)
	const sortedUsers = [...users].sort((a, b) => {
		const firstNameA = a.firstName.toLowerCase()
		const firstNameB = b.firstName.toLowerCase()

		// Compare first names
		if (firstNameA < firstNameB) {
			return -1 // a should come before b in the sorted order
		}
		if (firstNameA > firstNameB) {
			return 1 // a should come after b in the sorted order
		}
		return 0 // Names are equal
	})

	let adminUsers = sortedUsers
		.filter(user => user.role.title !== 'User')
		.map(user => {
			const name =
				user.lastName === ''
					? user.firstName
					: user.firstName + ' ' + user.lastName
			return {
				name,
				_id: user._id,
			}
		})

	adminUsers = formatData(adminUsers)

	const isOpen = useSelector(getDrawerOpenState)
	const isEditing = useSelector(getEditState)
	const isLoading = useSelector(getDrawerLoadingState)
	const blog = useSelector(getDrawerData)

	const updateForm = blog => {
		setFormError({})
		if (isEditing) {
			setFormValue(prev => {
				return {
					...prev,
					title: blog.title,
					excerpt: blog.excerpt,
					body: blog.body,
					author: blog?.author?._id || null,
					previewImage: blog.previewImage ? [blog.previewImage] : [],
					bannerImage: blog.bannerImage ? [blog.bannerImage] : [],
					tags: blog.tags,
					isActive: blog.isActive,
				}
			})
		} else {
			setFormValue({
				title: '',
				excerpt: '',
				body: '',
				author: '',
				previewImage: [],
				bannerImage: [],
				tags: [],
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
			await updateBlog(blog, formValue, imagesToBeDeleted)
			setImagesToBeDeleted([])
		} else {
			//create
			await createBlog(formValue)
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
			onEnter={() => updateForm(blog)}
			backdrop='static'
			size='lg'
		>
			<Drawer.Header style={{ paddingRight: '1.2em' }}>
				<Drawer.Title>{isEditing ? 'Edit' : 'Add'} Blog</Drawer.Title>
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
									name='author'
									label='Author'
									accepter={InputPicker}
									error={formError.author}
									data={adminUsers}
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
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='excerpt'
									label='Excerpt'
									accepter={TextArea}
									error={formError.excerpt}
									value={formValue.excerpt}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='body'
									label='Body'
									accepter={TextEditor}
									error={formError.body}
									value={blog ? blog.body : ''}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='tags'
									label='Tags'
									accepter={TagInput}
									error={formError.tags}
								/>
							</Col>
						</Row>

						<Row>
							<Col xs={12}>
								<ImagesUploader
									name='previewImage'
									accepter={Uploader}
									error={formError.previewImage}
									multiple
									listType='picture'
									action='//jsonplaceholder.typicode.com/posts/'
									defaultFileList={
										isEditing && blog.previewImage ? [blog.previewImage] : []
									}
									autoUpload={false}
									label='Preview Image'
									maxImages={1}
									noOfImages={formValue.previewImage.length}
									disabled={formValue.previewImage.length === 1}
									onRemove={grabRemovedImages}
								/>
							</Col>
							<Col xs={12}>
								<ImagesUploader
									name='bannerImage'
									accepter={Uploader}
									error={formError.bannerImage}
									multiple
									listType='picture'
									action='//jsonplaceholder.typicode.com/posts/'
									defaultFileList={
										isEditing && blog.bannerImage ? [blog.bannerImage] : []
									}
									autoUpload={false}
									label='Banner Image'
									maxImages={1}
									noOfImages={formValue.bannerImage.length}
									disabled={formValue.bannerImage.length === 1}
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
export default BlogsDrawer
