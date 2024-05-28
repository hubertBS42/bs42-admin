'use client'
import { calculateCartTotal, roundMoney } from '@/utils/functions'
import { useRef, useState } from 'react'
import {
	Button,
	Input,
	InputNumber,
	Popover,
	Stack,
	Text,
	Whisper,
} from 'rsuite'

const AddDiscountPopover = ({
	setOrderDetails,
	orderDetails,
	rate,
	cartItemsTotal,
	cartPriceTotal = null,
	isLoading,
}) => {
	const triggerRef = useRef()
	const open = () => triggerRef.current.open()
	const close = () => triggerRef.current.close()
	const [discount, setDiscount] = useState({
		percentage: 0,
		value: 0,
		reason: '',
	})
	const [cartTotal, setCartTotal] = useState(0)

	const updateForm = orderDetails => {
		if (cartPriceTotal) {
			setCartTotal(cartPriceTotal)
		} else {
			const total = calculateCartTotal(orderDetails.products)
			setCartTotal(total)
		}

		setDiscount({
			percentage: orderDetails.discount.percentage,
			value: orderDetails.discount.value,
			reason: orderDetails.discount.reason,
		})

		return
	}

	const handleSubmit = () => {
		setOrderDetails(prev => ({
			...prev,
			discount: {
				percentage: Number(discount.percentage),
				value: discount.value,
				reason: discount.reason,
			},
		}))
		close()
	}

	return (
		<Whisper
			placement='topEnd'
			ref={triggerRef}
			trigger='none'
			onEnter={() => updateForm(orderDetails)}
			speaker={
				<Popover>
					<Stack direction='column' alignItems='stretch' spacing={8}>
						<Stack direction='column' alignItems='flex-start' spacing={3}>
							<Text>Percentage:</Text>
							<InputNumber
								onChange={percentage => {
									const value = (percentage / 100) * cartTotal
									setDiscount(prev => ({ ...prev, percentage, value }))
								}}
								value={discount.percentage}
								min={0}
								max={100}
							/>
						</Stack>

						<Stack direction='column' alignItems='flex-start' spacing={3}>
							<Text>Value: GHS {roundMoney(discount.value * rate)}</Text>
						</Stack>

						<Stack direction='column' alignItems='stretch' spacing={3}>
							<Text>Reason:</Text>
							<Input
								as='textarea'
								onChange={reason =>
									setDiscount(prev => ({ ...prev, reason }))
								}
								value={discount.reason}
							/>
						</Stack>

						<Stack spacing={7} justifyContent='flex-end'>
							<Button appearance='primary' size='sm' onClick={handleSubmit}>
								Ok
							</Button>
							<Button size='sm' onClick={close}>
								Cancel
							</Button>
						</Stack>
					</Stack>
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
