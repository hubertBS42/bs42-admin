'use client'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import SlidesDrawer from '@/components/SlidesDrawer/SlidesDrawer'
import SlidesTable from '@/components/SlidesTable/SlidesTable'
import {
	deleteSlide,
	loadSlides,
} from '@/redux/features/slides/slidesActions'
import { useEffect } from 'react'

const page = () => {
	const handleDelete = async data => {
		await deleteSlide(data)
	}

	useEffect(() => {
		loadSlides()
	}, [])
	return (
		<div>
			<SlidesTable />
			<SlidesDrawer />
			<DeleteModal handleDelete={handleDelete} />
		</div>
	)
}
export default page
