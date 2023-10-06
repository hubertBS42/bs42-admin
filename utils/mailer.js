let nodemailer = require('nodemailer')
//-----------------------------------------------------------------------------
export async function sendMail(data) {
	const { sender, subject, toEmail, message } = data
	var transporter = nodemailer.createTransport({
		host: 'mail.bs42.co.uk',
		port: 465,
		secure: true,
		auth: {
			user: sender.email,
			pass: process.env.NEXT_PUBLIC_SMTP_PASSWORD,
		},
	})

	var mailOptions = {
		from: `${sender.title} < ${sender.email} >`,
		to: toEmail,
		subject: subject,
		text: message,
	}

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			throw new Error(error)
		} else {
			return true
		}
	})
}
