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
	const id = nanoid()

	const addFaq = () => {
		setFormValue(prev => {
			return {
				...prev,
				faqs: [
					{
						id,
						question: '',
						answer: '',
					},
					...faqs,
				],
			}
		})
	}

	const handleDelete = id => {
		const filtered = faqs.filter(faq => faq.id !== id)
		setFormValue(prev => {
			return { ...prev, faqs: filtered }
		})
	}

	const handleChange = (value, i, name) => {
		const newData = [...faqs]
		newData[i][name] = value
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
					{faqs.map((faq, index) => (
						<Panel key={faq.id}>
							<Row style={{ marginBottom: '1.2em' }}>
								<Col xs={24}>
									<label style={{ fontSize: 13 }}>Question:</label>
									<Input
										name='question'
										label='Question'
										onChange={(val, e) => handleChange(val, index, 'question')}
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
										onChange={(val, e) => handleChange(val, index, 'answer')}
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
									onClick={() => handleDelete(faq.id)}
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
