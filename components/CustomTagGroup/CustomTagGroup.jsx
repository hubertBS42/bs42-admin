import { Tag, TagGroup } from 'rsuite'

const CustomTagGroup = ({ data }) => {
	return (
		<TagGroup style={{ margin: 0 }}>
			{data.map(item => (
				<Tag key={item._id}>{item.resource.name}</Tag>
			))}
		</TagGroup>
	)
}
export default CustomTagGroup
