import { useRef, useState } from 'react'
import {
	Button,
	Cascader,
	Col,
	Drawer,
	Form,
	Input,
	InputNumber,
	InputPicker,
	Panel,
	Row,
	Schema,
	SelectPicker,
	Stack,
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
	getDrawerData,
	getDrawerLoadingState,
	getDrawerOpenState,
	getEditState,
	setDrawerClose,
} from '@/redux/features/drawer/drawerSlice'

import ImagesUploader from '../ImagesUploader/ImagesUploader'
import { selectAllBrands } from '@/redux/features/brands/brandsSlice'
import { selectAllCategories } from '@/redux/features/categories/categoriesSlice'
import TextEditor from '../TextEditor/TextEditor'
import {
	formatData,
	formatForTreePicker,
	roundMoney,
} from '@/utils/functions'
import QuantityPresets from '../QuantityPresets/QuantityPresets'
import FileUploader from '../FileUploader/FileUploader'
import {
	createProduct,
	updateProduct,
} from '@/redux/features/products/productsActions'
import FAQs from '../FAQs/FAQs'
import { getCurrentRate } from '@/redux/features/products/productsSlice'

const { StringType, ArrayType, NumberType } = Schema.Types

const model = Schema.Model({
	title: StringType().isRequired('This field is required'),
	brand: StringType().isRequired('This field is required'),
	condition: StringType().isRequired('This field is required'),
	category: StringType().isRequired('This field is required'),
	tags: ArrayType(),
	buyPrice: NumberType(),
	sellPrice: NumberType(),
	images: ArrayType().minLength(
		1,
		'You need to upload at least 1 image of the product.'
	),
	description: StringType(),
	discount: NumberType(),
})

const ProductsDrawer = () => {
	const dispatch = useDispatch()

	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [imagesToBeDeleted, setImagesToBeDeleted] = useState([])
	const [filesToBeDeleted, setFilesToBeDeleted] = useState([])

	const [formValue, setFormValue] = useState({
		title: '',
		brand: '',
		condition: 'new',
		buyPrice: 0,
		sellPrice: 0,
		resellerPrice: 0,
		isQuantityPreset: false,
		quantityPresets: [],
		images: [],
		category: '',
		tags: [],
		description: '',
		shippingAndReturns: null,
		instructions: null,
		warranty: null,
		faqs: [],
		onSale: false,
		featured: false,
		discount: 0,
		isActive: true,
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isEditing = useSelector(getEditState)
	const isLoading = useSelector(getDrawerLoadingState)

	const product = useSelector(getDrawerData)
	let brands = useSelector(selectAllBrands)
	brands = formatData(brands)
	let categories = useSelector(selectAllCategories)
	categories = formatForTreePicker(categories)
	let currentRate = useSelector(getCurrentRate)

	const updateForm = product => {
		setFormError({})
		if (isEditing) {
			setFormValue(prev => {
				return {
					...prev,
					title: product.title,
					brand: product?.brand?._id || null,
					condition: product.condition,
					buyPrice: product.buyPrice,
					sellPrice: product.sellPrice,
					resellerPrice: product.resellerPrice,
					isQuantityPreset: product.isQuantityPreset,
					quantityPresets: product.quantityPresets || [],
					images: product.images,
					category: product.category?._id || product.category,
					tags: product.tags,
					description: product.description,
					shippingAndReturns: product.shippingAndReturns || null,
					instructions: product.instructions || null,
					warranty: product.warranty || null,
					faqs: product?.faqs || [],
					onSale: product.onSale,
					featured: product.featured,
					discount: product.discount,
					isActive: product.isActive,
				}
			})
		} else {
			setFormValue({
				title: '',
				brand: '',
				condition: 'new',
				buyPrice: 0,
				sellPrice: 0,
				resellerPrice: 0,
				isQuantityPreset: false,
				quantityPresets: [],
				images: [],
				category: '',
				tags: [],
				description: '',
				shippingAndReturns: null,
				instructions: null,
				warranty: null,
				faqs: [],
				onSale: false,
				featured: false,
				discount: 0,
				isActive: true,
			})
		}

		return
	}

	const grabRemovedFiles = file => {
		setFilesToBeDeleted(prev => {
			return [...prev, file.name]
		})
	}

	const grabRemovedImages = file => {
		setImagesToBeDeleted(prev => {
			return [...prev, file.name]
		})
	}

	const handleSubmit = async () => {
		if (!formRef.current.check()) {
			return
		}

		if (isEditing) {
			//update
			await updateProduct(
				product,
				formValue,
				imagesToBeDeleted,
				filesToBeDeleted
			)
			setFilesToBeDeleted([])
			setImagesToBeDeleted([])
		} else {
			//add
			await createProduct(formValue)
		}
	}

	return (
		<Drawer
			open={isOpen}
			onClose={() => dispatch(setDrawerClose())}
			onEnter={() => updateForm(product)}
			backdrop='static'
			size='lg'
		>
			<Drawer.Header style={{ paddingRight: '1.2em' }}>
				<Drawer.Title>{isEditing ? 'Edit' : 'Add'} Product</Drawer.Title>
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

					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							rowGap: '1.8em',
						}}
					>
						<Panel
							header={
								<Stack justifyContent='space-between'>
									<span>General Informaton</span>
									<CustomToggle
										accepter={Toggle}
										name='featured'
										label='Featured'
									/>
								</Stack>
							}
							bordered
						>
							<Row style={{ marginBottom: '1.2em' }}>
								<Col xs={24}>
									<Field
										name='title'
										label='Title'
										accepter={Input}
										error={formError.title}
									/>
								</Col>
							</Row>

							<Row style={{ marginBottom: '1.2em' }}>
								<Col xs={24}>
									<Field
										name='brand'
										label='Brand'
										accepter={InputPicker}
										error={formError.brand}
										data={brands}
									/>
								</Col>
							</Row>

							<Row style={{ marginBottom: '1.2em' }}>
								<Col xs={24}>
									<Field
										name='condition'
										label='Condition'
										accepter={SelectPicker}
										error={formError.condition}
										data={[
											{ label: 'New', value: 'new' },
											{ label: 'Used', value: 'used' },
										]}
										searchable={false}
										// defaultValue={'new'}
									/>
								</Col>
							</Row>

							<Row style={{ marginBottom: '1.2em' }}>
								<Col xs={24}>
									<Field
										name='category'
										label='Category'
										accepter={Cascader}
										error={formError.category}
										parentSelectable
										block
										data={categories}
									/>
								</Col>
							</Row>

							<Row style={{ marginBottom: '1.2em' }}>
								<Col xs={24}>
									<Field
										name='description'
										label='Description'
										accepter={TextEditor}
										error={formError.description}
										value={product ? product.description : ''}
									/>
								</Col>
							</Row>

							<Row style={{ marginBottom: '1.2em' }}>
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
								<Col xs={24}>
									<ImagesUploader
										name='images'
										accepter={Uploader}
										error={formError.images}
										multiple
										listType='picture'
										action='//jsonplaceholder.typicode.com/posts/'
										defaultFileList={product ? product.images : []}
										autoUpload={false}
										label='Images'
										accept='image/jpeg, image/png'
										onRemove={grabRemovedImages}
										maxImages={6}
										noOfImages={formValue.images.length}
										disabled={formValue.images.length === 6}
									/>
								</Col>
							</Row>
						</Panel>

						<Panel
							header={
								<Stack justifyContent='space-between'>
									<span>Pricing Information</span>
									<Stack spacing={30}>
										<CustomToggle
											accepter={Toggle}
											name='onSale'
											label='On Sale'
										/>

										<CustomToggle
											accepter={Toggle}
											name='isQuantityPreset'
											label='Preset Quantity'
										/>
									</Stack>
								</Stack>
							}
							bordered
						>
							<Row style={{ marginBottom: '1.4em' }}>
								<Col xs={12}>
									<Field
										name='buyPrice'
										label='Buy Price'
										accepter={InputNumber}
										error={formError.buyPrice}
										min={0}
										prefix='$'
										postfix={`@ ${currentRate}`}
									/>
								</Col>
								<Col xs={12}>
									<Field
										name='buyPriceCedisEquiv'
										label='Buy Price'
										accepter={InputNumber}
										value={roundMoney(formValue.buyPrice * currentRate)}
										prefix='GHS'
										readOnly
									/>
								</Col>
							</Row>

							{!formValue.isQuantityPreset && (
								<>
									<Row style={{ marginBottom: '1.4em' }}>
										<Col xs={12}>
											<Field
												name='sellPrice'
												label='Sell Price'
												accepter={InputNumber}
												error={formError.sellPrice}
												min={0}
												prefix='$'
												postfix={`@ ${currentRate}`}
											/>
										</Col>
										<Col xs={12}>
											<Field
												name='sellPriceCedisEquiv'
												label='Sell Price'
												accepter={InputNumber}
												value={roundMoney(formValue.sellPrice * currentRate)}
												prefix='GHS'
												readOnly
											/>
										</Col>
									</Row>

									<Row style={{ marginBottom: '1.4em' }}>
										<Col xs={12}>
											<Field
												name='resellerPrice'
												label='Reseller Price'
												accepter={InputNumber}
												error={formError.resellerPrice}
												min={0}
												prefix='$'
												postfix={`@ ${currentRate}`}
											/>
										</Col>
										<Col xs={12}>
											<Field
												name='resellerPriceCedisEquiv'
												label='Reseller Price'
												accepter={InputNumber}
												value={roundMoney(formValue.resellerPrice * currentRate)}
												prefix='GHS'
												readOnly
											/>
										</Col>
									</Row>
								</>
							)}

							<Row style={{ marginBottom: '1.4em' }}>
								<Col xs={24}>
									<Field
										name='discount'
										label='Discount'
										accepter={InputNumber}
										error={formError.discount}
										min={0}
										postfix='%'
										disabled={!formValue.onSale}
									/>
								</Col>
							</Row>

							{formValue.isQuantityPreset && (
								<QuantityPresets
									data={formValue.quantityPresets}
									setFormValue={setFormValue}
								/>
							)}
						</Panel>

						<Panel header='Resources' bordered>
							<Row>
								<Col xs={8}>
									<FileUploader
										name='shippingAndReturns'
										accepter={Uploader}
										error={formError.shippingAndReturns}
										action='//jsonplaceholder.typicode.com/posts/'
										autoUpload={false}
										label='Shipping & Returns Policy'
										accept='application/pdf'
										multiple={false}
										draggable
										defaultFileList={
											product && product.shippingAndReturns
												? [product.shippingAndReturns]
												: []
										}
										disabled={
											formValue.shippingAndReturns === null
												? false
												: formValue.shippingAndReturns.length === 0
												? false
												: true
										}
										onRemove={grabRemovedFiles}
										onPreview={file => (window.location.href = file.url)}
									/>
								</Col>
								<Col xs={8}>
									<FileUploader
										name='instructions'
										accepter={Uploader}
										error={formError.instructions}
										action='//jsonplaceholder.typicode.com/posts/'
										autoUpload={false}
										label='Instruction Manual'
										accept='application/pdf'
										multiple={false}
										draggable
										defaultFileList={
											product && product.instructions
												? [product.instructions]
												: []
										}
										disabled={
											formValue.instructions === null
												? false
												: formValue.instructions.length === 0
												? false
												: true
										}
										onRemove={grabRemovedFiles}
										onPreview={file => (window.location.href = file.url)}
									/>
								</Col>
								<Col xs={8}>
									<FileUploader
										name='warranty'
										accepter={Uploader}
										error={formError.warrant}
										action='//jsonplaceholder.typicode.com/posts/'
										autoUpload={false}
										label='Warranty'
										accept='application/pdf'
										multiple={false}
										draggable
										defaultFileList={
											product && product.warranty ? [product.warranty] : []
										}
										disabled={
											formValue.warranty === null
												? false
												: formValue.warranty.length === 0
												? false
												: true
										}
										onRemove={grabRemovedFiles}
										onPreview={file => (window.location.href = file.url)}
									/>
								</Col>
							</Row>
						</Panel>

						<FAQs faqs={formValue.faqs} setFormValue={setFormValue} />
					</div>
				</Form>
			</Drawer.Body>
		</Drawer>
	)
}
export default ProductsDrawer
