'use client'
import {
	Col,
	Input,
	Panel,
	Row,
	Stack,
	TagInput,
	Accordion,
	Tabs,
} from 'rsuite'
import Field from '../Field/Field'
import TextEditor from '../TextEditor/TextEditor'

const NotificationsForm = () => {
	return (
		<Panel header='System Notifications' bordered>
			<Stack direction='column' alignItems='stretch' spacing={20}>
				<Panel header='Account Applications' bordered>
					<Tabs defaultActiveKey='1'>
						<Tabs.Tab eventKey='1' title='Administrators'>
							<Row style={{ marginBottom: 25 }}>
								<Col xs={24}>
									<Field
										name='recipients'
										label='Recipients'
										accepter={TagInput}
										// error={formError.currency}
										// data={formattedCurrencies}
									/>
								</Col>
							</Row>
							<Row style={{ marginBottom: 25 }}>
								<Col xs={24}>
									<Field
										name='title'
										label='Title'
										accepter={Input}
										// error={formError.currency}
										// data={formattedCurrencies}
									/>
								</Col>
							</Row>
							<Row style={{ marginBottom: 25 }}>
								<Col xs={24}>
									<Field
										name='body'
										label='Body'
										accepter={TextEditor}
										// error={formError.body}
										// value={blog ? blog.body : ''}
									/>
								</Col>
							</Row>
						</Tabs.Tab>
						<Tabs.Tab eventKey='2' title='Users'>
							<Row style={{ marginBottom: 25 }}>
								<Col xs={24}>
									<Field
										name='recipients'
										label='Recipients'
										accepter={TagInput}
										// error={formError.currency}
										// data={formattedCurrencies}
									/>
								</Col>
							</Row>
							<Row style={{ marginBottom: 25 }}>
								<Col xs={24}>
									<Field
										name='title'
										label='Title'
										accepter={Input}
										// error={formError.currency}
										// data={formattedCurrencies}
									/>
								</Col>
							</Row>
							<Row style={{ marginBottom: 25 }}>
								<Col xs={24}>
									<Field
										name='body'
										label='Body'
										accepter={TextEditor}
										// error={formError.body}
										// value={blog ? blog.body : ''}
									/>
								</Col>
							</Row>
						</Tabs.Tab>
					</Tabs>
				</Panel>

				<Panel header='New Orders' bordered>
					<Row style={{ marginBottom: 25 }}>
						<Col xs={24}>
							<Field
								name='recipients'
								label='Recipients'
								accepter={TagInput}
								// error={formError.currency}
								// data={formattedCurrencies}
							/>
						</Col>
					</Row>
					<Row style={{ marginBottom: 25 }}>
						<Col xs={24}>
							<Field
								name='title'
								label='Title'
								accepter={Input}
								// error={formError.currency}
								// data={formattedCurrencies}
							/>
						</Col>
					</Row>
					<Row style={{ marginBottom: 25 }}>
						<Col xs={24}>
							<Field
								name='body'
								label='Body'
								accepter={TextEditor}
								// error={formError.body}
								// value={blog ? blog.body : ''}
							/>
						</Col>
					</Row>
				</Panel>
			</Stack>
		</Panel>
	)
}
export default NotificationsForm
