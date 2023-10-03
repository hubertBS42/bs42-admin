'use client'

import {
	Button,
	Col,
	Form,
	Grid,
	Input,
	Loader,
	Row,
	Schema,
} from 'rsuite'
import Field from '../Field/Field'
import PasswordField from '../PasswordField/PasswordField'

import styles from './SigninForm.module.scss'
import { useSession, signIn } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Image from 'next/image'
import logo from 'public/images/logo-collapsed.png'
import loginImage from 'public/images/dashboard.jpg'

const { StringType } = Schema.Types

const model = Schema.Model({
	email: StringType(),
	password: StringType(),
})

const SignInForm = () => {
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [loading, setLoading] = useState(false)
	const { status } = useSession()
	const router = useRouter()

	useEffect(() => {
		if (status === 'authenticated') router.push('/')
	}, [router, status])

	const [formValue, setFormValue] = useState({
		email: '',
		password: '',
	})

	const handleSubmit = async e => {
		e.preventDefault()
		if (
			!formRef.current.check() ||
			formValue.email === '' ||
			formValue.password === ''
		) {
			return
		}

		setLoading(true)

		const status = await signIn('credentials', {
			redirect: false,
			email: formValue.email,
			password: formValue.password,
			callbackUrl: '/',
		})

		if (status.error !== null) {
			setLoading(false)
			toast.error('Incorrect login details.')
		} else {
			router.push('/')
		}
	}

	if (status === 'loading')
		return <Loader inverse center content='loading...' />

	return (
		<Grid fluid className={styles.mainWrapper}>
			<Row className={styles.innerWrapper}>
				<Col xs={12} className={styles.left}>
					<center>
						<Image
							src={logo}
							alt='logo'
							height={80}
							width={80}
							placeholder='blur'
							priority
						/>
					</center>
					<h1 className={styles.heading}>Portal Login</h1>
					<Form
						ref={formRef}
						onChange={setFormValue}
						onCheck={setFormError}
						formValue={formValue}
						model={model}
						disabled={loading}
						fluid
					>
						<Field
							name='email'
							type='email'
							label='Email Address'
							accepter={Input}
							size='lg'
							autoFocus
						/>
						<PasswordField
							name='password'
							label='Password'
							accepter={Input}
							size='lg'
						/>
						<Button
							onClick={handleSubmit}
							appearance='primary'
							disabled={loading}
							loading={loading}
							block
							type='submit'
							style={{ textTransform: 'uppercase', fontWeight: 500 }}
							size='lg'
						>
							Login
						</Button>
					</Form>
				</Col>
				<Col xs={12} className={styles.right}>
					<div className={styles.imageWrapper}>
						<Image
							src={loginImage}
							alt=''
							fill
							priority
							placeholder='blur'
						/>
					</div>
				</Col>
			</Row>
		</Grid>
	)
}
export default SignInForm
