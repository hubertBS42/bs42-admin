let nodemailer = require('nodemailer')
//-----------------------------------------------------------------------------
export async function sendMail(subject, toEmail, otpText) {
	var transporter = nodemailer.createTransport({
		host: 'mail.bs42.co.uk',
		port: 465,
		secure: true,
		auth: {
			// TODO: replace `user` and `pass` values from <https://forwardemail.net>
			user: process.env.NEXT_PUBLIC_SMTP_USER,
			pass: process.env.NEXT_PUBLIC_SMTP_PASSWORD,
		},
	})

	var mailOptions = {
		from: process.env.NEXT_PUBLIC_SMTP_USER,
		to: toEmail,
		subject: subject,
		text: otpText,
	}

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			throw new Error(error)
		} else {
			return true
		}
	})
}
