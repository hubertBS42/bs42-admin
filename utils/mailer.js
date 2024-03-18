import Template from '@/models/Template'
import Server from '@/models/Server'
import Credential from '@/models/Credential'
import nodemailer from 'nodemailer'
import { replacePlaceholders } from './functions'

export const fetchTemplate = async slug => {
	const template = await Template.findOne({
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

	return template
}

export const configMailer = async data => {
	const {
		toEmail = null,
		group,
		template,
		variables,
		attachments,
	} = data
	try {
		let transporter
		let mailOptions

		if (group === 'admins') {
			const hydratedMessage = replacePlaceholders(
				template.admins.message,
				variables
			)

			transporter = nodemailer.createTransport({
				host: template.admins.sender.server.host,
				port: template.admins.sender.server.port,
				secure: template.admins.sender.server.isSecure,
				auth: {
					user: template.admins.sender.user,
					pass: template.admins.sender.password,
				},
			})

			mailOptions = {
				from: `${template.admins.sender.label} < ${template.admins.sender.user} >`,
				to: toEmail ? toEmail : template.admins.recipients,
				subject: template.admins.subject,
				html: hydratedMessage,
				attachments,
			}
		} else {
			const hydratedMessage = replacePlaceholders(
				template.users.message,
				variables
			)

			transporter = nodemailer.createTransport({
				host: template.users.sender.server.host,
				port: template.users.sender.server.port,
				secure: template.users.sender.server.isSecure,
				auth: {
					user: template.users.sender.user,
					pass: template.users.sender.password,
				},
			})

			mailOptions = {
				from: `${template.users.sender.label} < ${template.users.sender.user} >`,
				to: toEmail ? toEmail : template.users.recipients,
				subject: template.users.subject,
				html: hydratedMessage,
				attachments,
			}
		}

		return { transporter, mailOptions }
	} catch (error) {
		throw new Error(error.message)
	}
}
