'use client'

import { Button, Form, Input, Loader, Panel, Schema } from 'rsuite'
import Field from '../Field/Field'
import PasswordField from '../PasswordField/PasswordField'

import styles from './SigninForm.module.scss'
import { useSession, signIn } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

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

	const handleSubmit = async () => {
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
		<Panel
			className={styles.panel}
			header={<h3>Dashboard Login</h3>}
			bordered
		>
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
				/>
				<PasswordField
					name='password'
					label='Password'
					accepter={Input}
				/>
				<Button
					onClick={handleSubmit}
					appearance='primary'
					disabled={loading}
					loading={loading}
				>
					Sign in
				</Button>
			</Form>
		</Panel>
	)
}
export default SignInForm
