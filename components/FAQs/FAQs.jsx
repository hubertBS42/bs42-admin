'use client'

import {
	Col,
	IconButton,
	Input,
	Panel,
	PanelGroup,
	Row,
	Stack,
} from 'rsuite'
import PlusIcon from '@rsuite/icons/Plus'
import TrashIcon from '@rsuite/icons/Trash'
import { nanoid } from '@reduxjs/toolkit'
import TextArea from '../TextArea/TextArea'

const FAQs = ({ faqs, setFormValue }) => {
	const index = nanoid()

	const addFaq = () => {
		setFormValue(prev => {
			return {
				...prev,
				faqs: [
					{
						index,
						question: '',
						answer: '',
					},
					...faqs,
				],
			}
		})
	}

	const handleDelete = index => {
		const filtered = faqs.filter(faq => faq.index !== index)
		setFormValue(prev => {
			return { ...prev, faqs: filtered }
		})
	}

	const handleChange = (value, index, name) => {
		const newData = faqs.map(faq => {
			if (faq.index === index) {
				return {
					...faq,
					[name]: value,
				}
			}
			return faq
		})
		setFormValue(prev => {
			return { ...prev, faqs: newData }
		})
	}

	return (
		<Panel
			header={
				<Stack justifyContent='space-between'>
					<span>Frequently Asked Questions</span>
					<IconButton
						icon={<PlusIcon />}
						circle
						size='xs'
						appearance='primary'
						onClick={addFaq}
					/>
				</Stack>
			}
			bordered
		>
			{faqs.length > 0 ? (
				<PanelGroup>
					{faqs.map(faq => (
						<Panel key={faq.index}>
							<Row style={{ marginBottom: '1.2em' }}>
								<Col xs={24}>
									<label style={{ fontSize: 13 }}>Question:</label>
									<Input
										name='question'
										label='Question'
										onChange={(val, e) =>
											handleChange(val, faq.index, 'question')
										}
										defaultValue={faq.question}
										style={{ marginTop: '.3em' }}
									/>
								</Col>
							</Row>

							<Row style={{ marginBottom: '1.4em' }}>
								<Col xs={24}>
									<label style={{ fontSize: 13 }}>Answer:</label>
									<TextArea
										name='answer'
										label='Answer'
										onChange={(val, e) =>
											handleChange(val, faq.index, 'answer')
										}
										defaultValue={faq.answer}
										style={{ marginTop: '.3em' }}
									/>
								</Col>
							</Row>

							<Stack justifyContent='flex-end'>
								<IconButton
									icon={<TrashIcon />}
									appearance='link'
									color='red'
									circle
									onClick={() => handleDelete(faq.index)}
								/>
							</Stack>
						</Panel>
					))}
				</PanelGroup>
			) : (
				<p
					style={{
						fontSize: 12,
						opacity: '.5',
						textAlign: 'center',
						marginTop: '1em',
						marginBottom: '1em',
					}}
				>
					There are no FAQs for this product.
				</p>
			)}
		</Panel>
	)
}
export default FAQs
