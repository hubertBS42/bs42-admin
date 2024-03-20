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
import { findActiveKey } from '@/utils/functions'

const SideNav = () => {
	const pathname = usePathname()
	const [expanded, setExpanded] = useState(true)

	const links = [
		{
			title: 'Dashboard',
			slug: '',
			eventKey: '1',
			icon: <DashboardIcon />,
			href: '/',
		},
		{
			title: 'Orders',
			slug: 'orders',
			eventKey: '2',
			icon: <DetailIcon />,
			href: '/orders',
		},
		{
			title: 'Applications',
			slug: 'applications',
			eventKey: '3',
			icon: <CreativeIcon />,
			href: '/applications',
		},
		{
			title: 'Manage Users',
			slug: null,
			eventKey: '4',
			icon: <PeoplesIcon />,
			href: null,
			sublinks: [
				{
					title: 'Users',
					slug: 'users',
					eventKey: '4-1',
					icon: null,
					href: '/users',
				},
				{
					title: 'Roles',
					slug: 'roles',
					eventKey: '4-2',
					icon: null,
					href: '/roles',
				},
				{
					title: 'Resources',
					slug: 'resources',
					eventKey: '4-3',
					icon: null,
					href: '/resources',
				},
			],
		},
		{
			title: 'Manage Products',
			slug: null,
			eventKey: '5',
			icon: <TagIcon />,
			href: null,
			sublinks: [
				{
					title: 'Products',
					slug: 'products',
					eventKey: '5-1',
					icon: null,
					href: '/products',
				},
				{
					title: 'Categories',
					slug: 'categories',
					eventKey: '5-2',
					icon: null,
					href: '/categories',
				},
				{
					title: 'Brands',
					slug: 'brands',
					eventKey: '5-3',
					icon: null,
					href: '/brands',
				},
			],
		},
		{
			title: 'Blogs',
			slug: 'blogs',
			eventKey: '6',
			icon: <TextImageIcon />,
			href: '/blogs',
		},
		{
			title: 'Messages',
			slug: 'messages',
			eventKey: '7',
			icon: <MessageIcon />,
			href: '/messages',
		},
		{
			title: 'Settings',
			slug: null,
			eventKey: '8',
			icon: <GearIcon />,
			href: null,
			sublinks: [
				{
					title: 'Banner Slides',
					slug: 'banner-slides',
					eventKey: '8-1',
					icon: null,
					href: '/settings/banner-slides',
				},
				{
					title: 'Currencies',
					slug: 'currencies',
					eventKey: '8-2',
					icon: null,
					href: '/settings/currencies',
				},
				{
					title: 'Email',
					slug: null,
					eventKey: '8-3',
					icon: null,
					href: null,
					sublinks: [
						{
							title: 'Outgoing Servers',
							slug: 'outgoing-servers',
							eventKey: '8-3-1',
							icon: null,
							href: '/settings/email/outgoing-servers',
						},
						{
							title: 'Credentials',
							slug: 'credentials',
							eventKey: '8-3-2',
							icon: null,
							href: '/settings/email/credentials',
						},
						{
							title: 'Templates',
							slug: 'templates',
							eventKey: '8-3-3',
							icon: null,
							href: '/settings/email/templates',
						},
					],
				},
			],
		},
	]

	const renderSideNav = links => {
		const navItems = []
		links.map((link, i) => {
			if (!link.hasOwnProperty('sublinks')) {
				navItems.push(
					<Nav.Item
						key={i}
						as={NavLink}
						eventKey={link.eventKey}
						icon={link.icon}
						href={link.href}
					>
						{link.title}
					</Nav.Item>
				)
			}

			if (link.hasOwnProperty('sublinks')) {
				navItems.push(
					<Nav.Menu
						eventKey={link.eventKey}
						title={link.title}
						icon={link.icon}
						key={i}
					>
						{renderSideNav(link.sublinks)}
					</Nav.Menu>
				)
			}
		})

		return navItems
	}

	const activePage = findActiveKey(links, pathname)

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
					<Nav activeKey={activePage}>{renderSideNav(links)}</Nav>
				</Sidenav.Body>
				<Sidenav.Toggle onToggle={expanded => setExpanded(expanded)} />
			</Sidenav>
		</div>
	)
}
export default SideNav
