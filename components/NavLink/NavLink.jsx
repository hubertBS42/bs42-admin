import Link from 'next/link'
import React from 'react'

// eslint-disable-next-line react/display-name
const NavLink = React.forwardRef((props, ref) => {
	const { as, href, ...rest } = props
	return (
		<Link href={href} as={as} legacyBehavior>
			<a ref={ref} {...rest} />
		</Link>
	)
})
export default NavLink
