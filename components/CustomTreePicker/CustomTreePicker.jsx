'use client'
import { TreePicker } from 'rsuite'
import ArrowDownLineIcon from '@rsuite/icons/ArrowDownLine'

const renderTreeIcon = node => {
	if (node.children?.length === 0) {
		return <span></span>
	}
	return <ArrowDownLineIcon />
}

const CustomTreePicker = props => {
	return <TreePicker {...props} renderTreeIcon={renderTreeIcon} />
}
export default CustomTreePicker
