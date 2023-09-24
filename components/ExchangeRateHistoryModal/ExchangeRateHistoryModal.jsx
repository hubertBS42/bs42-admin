'use client'
import { Modal, Placeholder } from 'rsuite'

const ExchangeRateHistoryModal = ({ open, handleClose }) => {
	return (
		<Modal open={open} onClose={handleClose}>
			<Modal.Header>
				<Modal.Title>Modal Title</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Placeholder.Paragraph />
			</Modal.Body>
		</Modal>
	)
}
export default ExchangeRateHistoryModal
