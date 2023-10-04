import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const CartSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			default: null,
		},
		sessionToken: { type: String, default: null },
		items: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Product',
				},
				quantity: { type: Number, default: 1 },
			},
		],
	},
	{ timestamps: true }
)

CartSchema.methods.genSessionToken = async function () {
	const cart = this

	const token = jwt.sign({ _id: cart._id }, 'abc123', {
		expiresIn: 60 * 60,
	})

	cart.sessionToken = token

	await cart.save()

	return token
}

export default mongoose.models.Cart ||
	mongoose.model('Cart', CartSchema)
