'use client'

import { Button, Form, Schema, Stack } from 'rsuite'
import CheckIcon from '@rsuite/icons/Check'
import { useRef, useState } from 'react'
import ExchangeRateSettings from '../ExchangeRateSettings/ExchangeRateSettings'
import { toast } from 'react-toastify'
import { fetcher } from '@/utils/functions'
import CarouselSlidesTable from '../CarouselSlidesTable/CarouselSlidesTable'
import CarouselSlidesDrawer from '../CarouselSlidesDrawer/CarouselSlidesDrawer'
import { updateImages } from '@/utils/azure'
import NotificationsSettings from '../NotificationsSettings/NotificationsSettings'

const { StringType, ArrayType, NumberType } = Schema.Types

const model = Schema.Model({
	currency: StringType().isRequired(
		'You will need to select a currency.'
	),
	currentRate: NumberType().isRequired(
		'You will need to provide a rate.'
	),
})

const SettingsForm = ({ data }) => {
	const { settings, currencies } = data
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [loading, setLoading] = useState(false)
	const [imagesToBeDeleted, setImagesToBeDeleted] = useState([])
	const [formValue, setFormValue] = useState({
		carouselSlides: settings[0]?.carouselSlides || [],
		// aNotificationRecipients:
		// 	settings[0]?.notifications?.newApplications?.recipients || [],
		currency: settings[0]?.exchangeRate?.currency._id,
		currentRate: settings[0]?.exchangeRate?.currentRate || 1,
		manualOverride: settings[0]?.exchangeRate?.manualOverride || false,
	})

	const toggleManualOverride = checked => {
		if (!checked) {
			const selectedCurrency = currencies.find(
				currency => currency._id === formValue.currency
			)
			const currentRate = selectedCurrency.history[0].rate
			setFormValue(prev => {
				return { ...prev, currentRate }
			})
		}
	}

	const addImagesToBeDeleted = name => {
		setImagesToBeDeleted(prev => {
			return [...prev, name]
		})
	}

	const addSlide = data => {
		setFormValue(prev => {
			return { ...prev, carouselSlides: [...prev.carouselSlides, data] }
		})
	}

	const editSlide = data => {
		const { imageToBeDeleted, ...slideData } = data

		let updatedSlides
		if (slideData.image[0].hasOwnProperty('blobFile')) {
			updatedSlides = formValue.carouselSlides.map(slide => {
				if (slide.index === slideData.index) {
					return { ...slideData, image: slideData.image }
				}
				return slide
			})
		} else {
			updatedSlides = formValue.carouselSlides.map(slide => {
				if (slide.index === slideData.index) {
					return { ...slideData, image: slideData.image[0] }
				}
				return slide
			})
		}

		setImagesToBeDeleted(prev => {
			return [...prev, ...imageToBeDeleted]
		})

		setFormValue(prev => {
			return { ...prev, carouselSlides: updatedSlides }
		})
	}

	const deleteSlide = data => {
		const updatedSlides = formValue.carouselSlides.filter(
			slide => slide.index !== data.index
		)

		if (data.image?.name) {
			addImagesToBeDeleted(data.image.name)
		}
		setFormValue(prev => {
			return { ...prev, carouselSlides: updatedSlides }
		})
	}

	const handleSubmit = async () => {
		if (!formRef.current.check()) {
			return
		}

		setLoading(true)

		let newSlides = formValue.carouselSlides.filter(slide =>
			Array.isArray(slide.image)
		)

		let currentSlides = formValue.carouselSlides.filter(
			slide => !Array.isArray(slide.image)
		)

		let imagesToBeUploaded = []

		if (newSlides.length > 0) {
			const images = newSlides.map(slide => slide.image[0].blobFile)

			imagesToBeUploaded = images
		}

		const uploadedImages = await updateImages(
			imagesToBeUploaded,
			imagesToBeDeleted
		)

		const updatedNewSlides = newSlides.map((slide, i) => {
			return { ...slide, image: uploadedImages[i] }
		})

		const preparedSlides = [...currentSlides, ...updatedNewSlides]

		const preparedData = {
			carouselSlides: preparedSlides,
			exchangeRate: {
				currency: formValue.currency,
				currentRate: Number(formValue.currentRate),
				manualOverride: formValue.manualOverride,
			},
		}

		const { status, message, data } = await fetcher(
			`/api/settings/${settings[0]._id}`,
			{
				method: 'PATCH',
				body: JSON.stringify(preparedData),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
			}
		)

		setLoading(false)
		if (status === 'success') {
			setFormValue(prev => {
				return { ...prev, ...data }
			})
			setImagesToBeDeleted([])
			toast.success('Settings were updated successfully.')
			return
		}
		toast.error('Failed to to update settings.')
	}

	// const handleDelete = async data => {
	// 	await deleteBrand(data)
	// }

	return (
		<>
			<CarouselSlidesDrawer
				data={formValue}
				settings={settings}
				addSlide={addSlide}
				editSlide={editSlide}
			/>
			<Form
				ref={formRef}
				onChange={setFormValue}
				onCheck={setFormError}
				formValue={formValue}
				model={model}
				fluid
				disabled={loading}
			>
				<Stack direction='column' alignItems='stretch' spacing={20}>
					<Stack justifyContent='flex-end'>
						<Button
							onClick={handleSubmit}
							appearance='primary'
							startIcon={<CheckIcon />}
							loading={loading}
							disabled={loading}
						>
							Save
						</Button>
					</Stack>

					<CarouselSlidesTable
						data={formValue}
						deleteSlide={deleteSlide}
					/>
					{/* <DeleteModal handleDelete={handleDelete} /> */}

					<ExchangeRateSettings
						currencies={currencies}
						handleChange={toggleManualOverride}
						formError={formError}
						formValue={formValue}
					/>
					{/* <NotificationsSettings /> */}
				</Stack>
			</Form>
		</>
	)
}
export default SettingsForm
