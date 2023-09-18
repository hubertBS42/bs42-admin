'use client'
import {
	getModalData,
	getModalLoadingState,
	getModalOpenState,
	setModalClose,
} from '@/redux/features/modal/modalSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal } from 'rsuite'
const DeleteModal = ({ handleDelete }) => {
	const dispatch = useDispatch()

	const isLoading = useSelector(getModalLoadingState)
	const isOpen = useSelector(getModalOpenState)
	const data = useSelector(getModalData)
	return (
		<Modal
			open={isOpen}
			onClose={() => dispatch(setModalClose())}
			backdrop='static'
			role='alertdialog'
			size='xs'
		>
			<Modal.Header>
				<Modal.Title>Confirm Deletion</Modal.Title>
			</Modal.Header>
			<Modal.Body style={{ textAlign: 'center' }}>
				Are you sure you want to delete &apos;
				{data?.title || data?.name || data?.firstName}
				&apos;? This cannot be undone.
			</Modal.Body>
			<Modal.Footer>
				<Button
					onClick={() => dispatch(setModalClose())}
					appearance='primary'
					color='red'
					disabled={isLoading}
				>
					No
				</Button>
				<Button
					onClick={() => handleDelete(data)}
					appearance='primary'
					loading={isLoading}
					disabled={isLoading}
				>
					Yes
				</Button>
			</Modal.Footer>
		</Modal>
	)
}
export default DeleteModal
