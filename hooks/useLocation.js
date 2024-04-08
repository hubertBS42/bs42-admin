import { useEffect, useState } from 'react'
import { geoData } from '@/utils/data'

export const useLocation = () => {
	const [towns, setTowns] = useState([])
	const [regions, setRegions] = useState([])

	const handleRegion = value => {
		const region = geoData.find(region => region.name === value)
		console.log(region)
		const formattedTowns = region.towns.map(town => ({
			label: town,
			value: town,
		}))
		setTowns(formattedTowns)
	}

	useEffect(() => {
		const formattedRegions = geoData.map(region => ({
			label: region.name,
			value: region.name,
		}))

		setRegions(formattedRegions)
	}, [])

	const clearTowns = () => setTowns([])

	return [regions, towns, handleRegion, clearTowns]
}
