import SignInForm from '@/components/SignInForm/SignInForm'
import styles from './page.module.scss'

const SignInPage = ({ params }) => {
	console.log(params)
	return (
		<div className={styles.mainWrapper}>
			<SignInForm />
		</div>
	)
}
export default SignInPage
