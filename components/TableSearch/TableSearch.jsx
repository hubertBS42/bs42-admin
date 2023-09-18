'use client'

import { Input, InputGroup } from 'rsuite'
import SearchIcon from '@rsuite/icons/Search'

const TableSearch = ({ handleSearch }) => {
	return (
		<InputGroup inside style={{ width: '400px' }}>
			<Input
				placeholder='Search...'
				onChange={value => handleSearch(value)}
			/>
			<InputGroup.Addon>
				<SearchIcon />
			</InputGroup.Addon>
		</InputGroup>
	)
}
export default TableSearch
