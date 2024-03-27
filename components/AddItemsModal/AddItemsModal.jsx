'use client'
import { useProducts } from '@/hooks/useProducts'
import {
	addItem,
	removeItem,
	selectAllCartItems,
} from '@/redux/features/cart/cartSlice'
import { selectAllCategories } from '@/redux/features/categories/categoriesSlice'
import { getCurrentRate } from '@/redux/features/orders/ordersSlice'
import {
	groupCategories,
	lineClamp,
	roundMoney,
} from '@/utils/functions'

import SpinnerIcon from '@rsuite/icons/legacy/Spinner'
import SearchIcon from '@rsuite/icons/Search'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'

import {
	Button,
	Checkbox,
	Input,
	InputGroup,
	Modal,
	Panel,
	PanelGroup,
	Stack,
	Tag,
	Tooltip,
	Whisper,
} from 'rsuite'

const AddItemsModal = ({ open, handleClose, rate }) => {
	const dispatch = useDispatch()
	const categories = useSelector(selectAllCategories)
	const items = useSelector(selectAllCartItems)

	const groupedCategories = groupCategories(categories)
	const [results, loading, searchProducts] = useProducts(
		[],
		groupedCategories
	)

	const handleChecked = (checked, data) => {
		if (checked) {
			dispatch(addItem(data))
		} else {
			dispatch(removeItem(data))
		}
	}

	return (
		<Modal
			overflow={true}
			open={open}
			onClose={handleClose}
			backdrop='static'
			size='md'
		>
			<Modal.Header>
				<Modal.Title>Add items</Modal.Title>
			</Modal.Header>
			<Modal.Body style={{ paddingRight: 14, marginBottom: 14 }}>
				<InputGroup inside>
					<InputGroup.Addon>
						<SearchIcon />
					</InputGroup.Addon>
					<Input
						placeholder='Search products'
						onChange={searchProducts}
						style={{ width: '100%' }}
					/>
					<InputGroup.Addon>
						{loading && <SpinnerIcon spin />}
					</InputGroup.Addon>
				</InputGroup>

				<PanelGroup>
					{results.length > 0 &&
						results.map(result => (
							<Panel key={result.category} header={result.category}>
								{result.products.map(product => (
									<Stack
										key={product._id}
										style={{ marginBottom: 17 }}
										justifyContent='space-between'
									>
										<Stack spacing={10}>
											<Checkbox
												onChange={(value, checked) =>
													handleChecked(checked, product)
												}
												checked={items
													.map(item => item.product._id)
													.includes(product._id)}
											/>

											<Stack spacing={15} style={{ fontSize: 13 }}>
												<div
													style={{
														position: 'relative',
														height: 40,
														width: 40,
														objectFit: 'contain',
													}}
												>
													<Image
														src={product.images[0].url}
														alt={product.title}
														fill
														sizes='(max-width: 768px) 40px, (max-width: 1200px) 40px, 40px'
													/>
												</div>
												<Stack direction='column' alignItems='flex-start'>
													<span style={{ color: '#6CD6FF' }}>{product.title}</span>
													<span style={{ fontSize: 11 }}>
														{product.brand.title}
													</span>
												</Stack>
											</Stack>
										</Stack>

										<Stack spacing={20}>
											<span>{product.countInStock} in stock</span>
											<span>GHS {roundMoney(product.sellPrice * rate)}</span>
										</Stack>
									</Stack>
								))}
							</Panel>
						))}
				</PanelGroup>
			</Modal.Body>
			<Modal.Footer>
				<Stack justifyContent='space-between'>
					<Stack alignItems='center' spacing={7}>
						{items.map(item => (
							<Whisper
								placement='top'
								trigger='hover'
								speaker={<Tooltip>{item.product.title}</Tooltip>}
								key={item.product._id}
							>
								<Tag
									closable
									onClose={() => handleChecked(false, item.product)}
								>
									{lineClamp(item.product.title, 20)}
								</Tag>
							</Whisper>
						))}
					</Stack>

					<Stack>
						<Button onClick={handleClose} appearance='primary' size='sm'>
							Done
						</Button>
						<Button onClick={handleClose} appearance='subtle' size='sm'>
							Cancel
						</Button>
					</Stack>
				</Stack>
			</Modal.Footer>
		</Modal>
	)
}
export default AddItemsModal
