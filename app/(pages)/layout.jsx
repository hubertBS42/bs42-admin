import CheckAuthenticated from '@/components/CheckAuthenticated/CheckAuthenticated'
import styles from './layout.module.scss'

import SideNav from '@/components/SideNav/SideNav'
import TopNav from '@/components/TopNav/TopNav'

export default function RootLayout({ children }) {
	return (
		<CheckAuthenticated>
			<div className={styles.mainWrapper}>
				<SideNav />

				<section className={styles.right}>
					<TopNav />

					<main>{children}</main>
				</section>
			</div>
		</CheckAuthenticated>
	)
}
