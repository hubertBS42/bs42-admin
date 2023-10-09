'use client'
import {
	getModalData,
	getModalLoadingState,
	getModalOpenState,
	setModalClose,
} from '@/redux/features/modal/modalSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, Grid, List, Modal, Row } from 'rsuite'
import CheckIcon from '@rsuite/icons/Check'
import CloseIcon from '@rsuite/icons/Close'
import { formatDate } from '@/utils/functions'

const DetailsModal = () => {
	const dispatch = useDispatch()

	const isLoading = useSelector(getModalLoadingState)
	const isOpen = useSelector(getModalOpenState)
	const data = useSelector(getModalData)
	return (
		<Modal
			open={isOpen}
			onClose={() => dispatch(setModalClose())}
			role='alertdialog'
			size='sm'
		>
			<Modal.Header>
				<Modal.Title>New Application</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<List bordered>
					<List.Item>
						Name: {data?.firstName} {data?.lastName}
					</List.Item>
					<List.Item>Email: {data?.email}</List.Item>
					<List.Item>Number: {data?.phone1}</List.Item>
					<List.Item>Company Name: {data?.company.name}</List.Item>
					<List.Item>
						Receive Emails: {data?.canReceiveEmails ? 'Yes' : 'No'}
					</List.Item>
					<List.Item>
						Application Data: {formatDate(data?.createdAt)}
					</List.Item>
				</List>
			</Modal.Body>
			<Modal.Footer>
				<Grid fluid>
					<Row>
						<Col xs={12}>
							<Button
								// onClick={}
								appearance='primary'
								color='red'
								disabled={isLoading}
								block
								style={{ textTransform: 'uppercase' }}
							>
								Disapprove
							</Button>
						</Col>
						<Col xs={12}>
							<Button
								// onClick={}
								appearance='primary'
								disabled={isLoading}
								block
								style={{ textTransform: 'uppercase' }}
							>
								Approve
							</Button>
						</Col>
					</Row>
				</Grid>
			</Modal.Footer>
		</Modal>
	)
}
export default DetailsModal
