'use client'

import { useState } from 'react'
import styles from './SideNav.module.scss'
import { Nav, Sidenav } from 'rsuite'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import DashboardIcon from '@rsuite/icons/legacy/Dashboard'
import MessageIcon from '@rsuite/icons/Message'
import DetailIcon from '@rsuite/icons/Detail'
import PeoplesIcon from '@rsuite/icons/Peoples'
import TagIcon from '@rsuite/icons/Tag'
import TextImageIcon from '@rsuite/icons/TextImage'
import CreativeIcon from '@rsuite/icons/Creative'
import GearIcon from '@rsuite/icons/Gear'
import logoCollapsed from '@/public/images/logo-collapsed.png'
import logo from '@/public/images/logo.png'
import NavLink from '../NavLink/NavLink'

let activePage = '1'

const SideNav = () => {
	const pathname = usePathname()
	const [expanded, setExpanded] = useState(true)

	if (pathname.includes('orders')) {
		activePage = '2'
	}

	if (pathname.includes('applications')) {
		activePage = '3'
	}

	if (pathname.includes('users')) {
		activePage = '4-1'
	}

	if (pathname.includes('roles')) {
		activePage = '4-2'
	}

	if (pathname.includes('resources')) {
		activePage = '4-3'
	}

	if (pathname.includes('products')) {
		activePage = '5-1'
	}

	if (pathname.includes('categories')) {
		activePage = '5-2'
	}

	if (pathname.includes('brands')) {
		activePage = '5-3'
	}

	if (pathname.includes('blogs')) {
		activePage = '6'
	}

	if (pathname.includes('messages')) {
		activePage = '7'
	}

	if (pathname.includes('banner-slides')) {
		activePage = '8-1'
	}

	if (pathname.includes('currencies')) {
		activePage = '8-2'
	}

	if (pathname.includes('notifications')) {
		activePage = '8-3'
	}

	if (pathname.includes('outgoing-servers')) {
		activePage = '8-3-1'
	}

	if (pathname.includes('credentials')) {
		activePage = '8-3-2'
	}

	if (pathname.includes('notification-profiles')) {
		activePage = '8-3-3'
	}

	let defaultOpenKeys = activePage.split('-')

	if (defaultOpenKeys.length > 2) {
		defaultOpenKeys = [
			`${defaultOpenKeys[0]}`,
			`${defaultOpenKeys[0]}-${defaultOpenKeys[1]}`,
		]
	} else {
		defaultOpenKeys.pop()
	}

	return (
		<div
			className={styles.mainWrapper}
			style={expanded ? { width: '240px' } : {}}
		>
			<Sidenav
				appearance='subtle'
				defaultOpenKeys={defaultOpenKeys}
				expanded={expanded}
			>
				<Sidenav.Header className={styles.header}>
					<div className={styles.logoWrapper}>
						{expanded ? (
							<Image src={logo} alt='BS42.NET logo' width={100} priority />
						) : (
							<Image
								src={logoCollapsed}
								alt='bs42.net logo'
								priority
								width={20}
							/>
						)}
					</div>
				</Sidenav.Header>
				<Sidenav.Body>
					<Nav activeKey={activePage}>
						<Nav.Item
							as={NavLink}
							eventKey='1'
							icon={<DashboardIcon />}
							href='/'
						>
							Dashboard
						</Nav.Item>

						<Nav.Item
							as={NavLink}
							eventKey='2'
							icon={<DetailIcon />}
							href='/orders'
						>
							Orders
						</Nav.Item>

						<Nav.Item
							as={NavLink}
							eventKey='3'
							icon={<CreativeIcon />}
							href='/applications'
						>
							Applications
						</Nav.Item>

						<Nav.Menu
							eventKey='4'
							title='Manage Users'
							icon={<PeoplesIcon />}
						>
							<Nav.Item eventKey='4-1' as={NavLink} href='/users'>
								Users
							</Nav.Item>
							<Nav.Item eventKey='4-2' as={NavLink} href='/users/roles'>
								Roles
							</Nav.Item>
							<Nav.Item eventKey='4-3' as={NavLink} href='/users/resources'>
								Resources
							</Nav.Item>
						</Nav.Menu>

						<Nav.Menu
							eventKey='5'
							title='Manage Products'
							icon={<TagIcon />}
						>
							<Nav.Item eventKey='5-1' as={NavLink} href='/products'>
								Products
							</Nav.Item>
							<Nav.Item
								eventKey='5-2'
								as={NavLink}
								href='/products/categories'
							>
								Categories
							</Nav.Item>
							<Nav.Item eventKey='5-3' as={NavLink} href='/products/brands'>
								Brands
							</Nav.Item>
						</Nav.Menu>

						<Nav.Item
							as={NavLink}
							eventKey='6'
							icon={<TextImageIcon />}
							href='/blogs'
						>
							Blogs
						</Nav.Item>

						<Nav.Item
							as={NavLink}
							eventKey='7'
							icon={<MessageIcon />}
							href='/messages'
						>
							Messages
						</Nav.Item>

						<Nav.Menu eventKey='8' title='Settings' icon={<GearIcon />}>
							<Nav.Item
								eventKey='8-1'
								as={NavLink}
								href='/settings/banner-slides'
							>
								Banner Slides
							</Nav.Item>
							<Nav.Item
								eventKey='8-2'
								as={NavLink}
								href='/settings/currencies'
							>
								Currencies
							</Nav.Item>

							<Nav.Menu eventKey='8-3' title='Email'>
								<Nav.Item
									eventKey='8-3-1'
									as={NavLink}
									href='/settings/email/outgoing-servers'
								>
									Outgoing Servers
								</Nav.Item>
								<Nav.Item
									eventKey='8-3-2'
									as={NavLink}
									href='/settings/email/credentials'
								>
									Credentials
								</Nav.Item>
								<Nav.Item
									eventKey='8-3-3'
									as={NavLink}
									href='/settings/email/notification-profiles'
								>
									Notification Profiles
								</Nav.Item>
							</Nav.Menu>
						</Nav.Menu>
					</Nav>
				</Sidenav.Body>
				<Sidenav.Toggle onToggle={expanded => setExpanded(expanded)} />
			</Sidenav>
		</div>
	)
}
export default SideNav
