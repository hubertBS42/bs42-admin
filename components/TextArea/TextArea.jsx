import { forwardRef } from 'react'
import { Input } from 'rsuite'

// eslint-disable-next-line react/display-name
const TextArea = forwardRef((props, ref) => (
	<Input {...props} as='textarea' ref={ref} />
))
export default TextArea
