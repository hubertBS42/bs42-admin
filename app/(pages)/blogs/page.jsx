'use client'

import BlogsTable from '@/components/BlogsTable/BlogsTable'
import styles from './page.module.scss'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import {
	deleteBlog,
	loadBlogs,
} from '@/redux/features/blogs/blogsActions'
import { useEffect } from 'react'
import BlogsDrawer from '@/components/BlogsDrawer/BlogsDrawer'
import { loadData } from '@/redux/features/users/usersActions'
import { selectAllUsers } from '@/redux/features/users/usersSlice'

const BlogsPage = () => {
	const handleDelete = async data => {
		await deleteBlog(data)
	}

	useEffect(() => {
		loadBlogs()
		loadData()
	}, [])

	return (
		<div className={styles.mainWrapper}>
			<BlogsTable />
			<BlogsDrawer />
			<DeleteModal handleDelete={handleDelete} />
		</div>
	)
}
export default BlogsPage
