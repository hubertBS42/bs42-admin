'use client'
import { useRef, useState } from 'react'
import {
	Button,
	InputNumber,
	Popover,
	Stack,
	Text,
	Whisper,
} from 'rsuite'

const AddShippingPopover = ({
	setOrderDetails,
	orderDetails,
	rate,
}) => {
	const triggerRef = useRef()
	const open = () => triggerRef.current.open()
	const close = () => triggerRef.current.close()
	const [shipping, setShipping] = useState(0)

	const updateForm = orderDetails => {
		setShipping(orderDetails.shipping.cost * rate)

		return
	}

	const handleSubmit = () => {
		setOrderDetails(prev => ({
			...prev,
			shipping: {
				...orderDetails.shipping,
				cost: shipping / rate,
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
							<Text>Amount(GHS):</Text>
							<InputNumber
								onChange={amount => setShipping(amount)}
								value={shipping}
								min={0}
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
				disabled={orderDetails.shipping.method === 'pickup'}
			>
				Add shipping
			</Button>
		</Whisper>
	)
}
export default AddShippingPopover
