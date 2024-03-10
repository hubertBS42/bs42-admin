import NotificationProfile from '@/models/NotificationProfile'
import Server from '@/models/Server'
import Credential from '@/models/Credential'
import nodemailer from 'nodemailer'
import { replacePlaceholders } from './functions'

export const fetchProfile = async slug => {
	const profile = await NotificationProfile.findOne({
		slug,
	})
		.populate({
			path: 'admins.sender',
			model: 'Credential',
			populate: {
				path: 'server',
				model: 'Server',
			},
		})
		.populate({
			path: 'users.sender',
			model: 'Credential',
			populate: {
				path: 'server',
				model: 'Server',
			},
		})

	return profile
}

export const configMailer = async data => {
	const { toEmail = null, group, profile, variables } = data
	try {
		let transporter
		let mailOptions

		if (group === 'admins') {
			const hydratedMessage = replacePlaceholders(
				profile.admins.message,
				variables
			)

			transporter = nodemailer.createTransport({
				host: profile.admins.sender.server.host,
				port: profile.admins.sender.server.port,
				secure: profile.admins.sender.server.isSecure,
				auth: {
					user: profile.admins.sender.user,
					pass: profile.admins.sender.password,
				},
			})

			mailOptions = {
				from: `${profile.admins.sender.label} < ${profile.admins.sender.user} >`,
				to: toEmail ? toEmail : profile.admins.recipients,
				subject: profile.admins.subject,
				html: hydratedMessage,
			}
		} else {
			const hydratedMessage = replacePlaceholders(
				profile.users.message,
				variables
			)

			transporter = nodemailer.createTransport({
				host: profile.users.sender.server.host,
				port: profile.users.sender.server.port,
				secure: profile.users.sender.server.isSecure,
				auth: {
					user: profile.users.sender.user,
					pass: profile.users.sender.password,
				},
			})

			mailOptions = {
				from: `${profile.users.sender.label} < ${profile.users.sender.user} >`,
				to: toEmail ? toEmail : profile.users.recipients,
				subject: profile.users.subject,
				html: hydratedMessage,
			}
		}

		return { transporter, mailOptions }
	} catch (error) {
		throw new Error(error.message)
	}
}
