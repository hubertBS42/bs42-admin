import mongoose from 'mongoose'
import Credential from './Credential'

const ServerSchema = new mongoose.Schema(
	{
		label: {
			type: String,
			required: true,
			unique: true,
		},
		host: { type: String, required: true },
		port: { type: Number, required: true },
		isSecure: { type: Boolean, default: true },
		description: { type: String },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
)

ServerSchema.pre('findOneAndDelete', async function (next) {
	try {
		// Find all credentials referencing this server
		const credentials = await Credential.find({
			server: this.getQuery()._id,
		})

		// Iterate through credentials and delete each one
		for (const credential of credentials) {
			await Credential.findByIdAndRemove(credential._id)
			console.log('Deleted credential:', credential)
		}

		// Proceed with the deletion of the Server
		next()
	} catch (err) {
		console.error('Error deleting credentials:', err)
		next(err)
	}
})

const Server =
	mongoose.models.Server || mongoose.model('Server', ServerSchema)

export default Server
