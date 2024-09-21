'use client'
import { calculateCartTotal, roundMoney } from '@/utils/functions'
import { useRef, useState } from 'react'
import {
	Button,
	HStack,
	Input,
	InputGroup,
	InputNumber,
	Popover,
	SelectPicker,
	Stack,
	Text,
	Toggle,
	VStack,
	Whisper,
} from 'rsuite'
import CustomToggle from '../CustomToggle/CustomToggle'

const AddDiscountPopover = ({
	setOrderDetails,
	orderDetails,
	rate,
	cartItemsTotal,
	cartPriceTotal = null,
	newOrder = false,
	isLoading,
}) => {
	const triggerRef = useRef()
	const open = () => triggerRef.current.open()
	const close = () => triggerRef.current.close()
	const [discount, setDiscount] = useState({
		type: 'percentage',
		value: 0,
		reason: '',
		equivalent: 0,
	})
	const [cartTotal, setCartTotal] = useState(0)

	const updateForm = orderDetails => {
		if (cartPriceTotal) {
			setCartTotal(cartPriceTotal)
		} else {
			const total = calculateCartTotal(orderDetails.products)
			setCartTotal(total)
		}

		let discountEquivalent

		if (orderDetails.discount.type === 'percentage') {
			discountEquivalent =
				(orderDetails.discount.value / 100) * cartTotal
			discountEquivalent = discountEquivalent * rate
		}

		if (newOrder && orderDetails.discount.type === 'amount') {
			discountEquivalent = orderDetails.discount.value
		}

		if (!newOrder && orderDetails.discount.type === 'amount') {
			discountEquivalent = orderDetails.discount.equivalent
		}

		// if (orderDetails.discount.type === 'percentage') {
		// 	discountEquivalent =
		// 		(orderDetails.discount.value / 100) * cartTotal
		// 	discountEquivalent = roundMoney(discountEquivalent * rate)
		// } else {
		// 	discountEquivalent = orderDetails.discount.value
		// }

		setDiscount({
			type: orderDetails.discount.type,
			value:
				!newOrder && orderDetails.discount.type === 'amount'
					? discountEquivalent
					: orderDetails.discount.value,
			reason: orderDetails.discount.reason,
			equivalent: discountEquivalent,
		})

		return
	}

	const handleSubmit = () => {
		setOrderDetails(prev => ({
			...prev,
			discount: {
				...discount,
				value:
					!newOrder && discount.type === 'amount'
						? discount.value / rate
						: discount.value,
			},
		}))
		close()
	}
	// const handleSubmit = () => {
	// 	setOrderDetails(prev => ({
	// 		...prev,
	// 		discount: {
	// 			type: discount.type,
	// 			value:
	// 				discount.type === 'percentage'
	// 					? Number(discount.value)
	// 					: Number(discount.value) / rate,
	// 			reason: discount.reason,
	// 		},
	// 	}))
	// 	close()
	// }

	return (
		<Whisper
			placement='topEnd'
			ref={triggerRef}
			trigger='none'
			onEnter={() => updateForm(orderDetails)}
			speaker={
				<Popover style={{ width: 300 }}>
					<VStack spacing={8} alignItems='stretch'>
						<HStack justifyContent='flex-end'>
							<Toggle
								size='md'
								checkedChildren='₵'
								unCheckedChildren='%'
								checked={discount.type === 'amount'}
								onChange={checked => {
									const type = checked ? 'amount' : 'percentage'
									setDiscount(prev => ({
										...prev,
										type,
										value: 0,
										equivalent: 0,
									}))
								}}
							/>
						</HStack>
						<VStack>
							<Text size='md'>Value:</Text>
							<InputGroup>
								<InputNumber
									min={0}
									step={0.1}
									formatter={value =>
										`${discount.type === 'percentage' ? '%' : 'GHS'} ${value}`
									}
									value={discount.value}
									onChange={value => {
										let equivalent
										if (discount.type === 'percentage') {
											equivalent = (Number(value) / 100) * cartTotal
											equivalent = equivalent * rate
										} else {
											equivalent = Number(value)
										}
										setDiscount(prev => ({
											...prev,
											value: Number(value),
											equivalent,
										}))
									}}
								/>
								<InputGroup.Addon>~</InputGroup.Addon>
								<InputNumber
									readOnly
									value={roundMoney(discount.equivalent)}
									formatter={value => `GHS ${value}`}
								/>
							</InputGroup>
						</VStack>

						<VStack alignItems='stretch'>
							<Text>Reason:</Text>
							<Input
								as='textarea'
								onChange={reason =>
									setDiscount(prev => ({ ...prev, reason }))
								}
								value={discount.reason}
							/>
						</VStack>

						<Stack spacing={7} justifyContent='flex-end'>
							<Button appearance='primary' size='sm' onClick={handleSubmit}>
								Ok
							</Button>
							<Button size='sm' onClick={close}>
								Cancel
							</Button>
						</Stack>
					</VStack>
				</Popover>
			}
		>
			<Button
				appearance='link'
				style={{ padding: 0, fontSize: 13 }}
				onClick={open}
				disabled={cartItemsTotal === 0 || isLoading}
			>
				Add discount
			</Button>
		</Whisper>
	)
}
export default AddDiscountPopover
