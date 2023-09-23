let nodemailer = require('nodemailer')
//-----------------------------------------------------------------------------
export async function sendMail(subject, toEmail, otpText) {
	var transporter = nodemailer.createTransport({
		host: 'mail.bs42.co.uk',
		port: 465,
		secure: true,
		auth: {
			// TODO: replace `user` and `pass` values from <https://forwardemail.net>
			user: 'hubert@attelecoms.co.uk',
			pass: 'HQSowah18',
		},
	})

	var mailOptions = {
		from: 'hubert@attelecoms.co.uk',
		to: toEmail,
		subject: subject,
		text: otpText,
	}

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			throw new Error(error)
		} else {
			console.log('Email Sent')
			return true
		}
	})
}
