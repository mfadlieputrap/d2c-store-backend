import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
	userId:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	productId:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product',
		required: true
	},
	variant:{
		color: String,
		size: String
	},
	quantity: {
		type: Number,
		required: true,
		min: 1
	}
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;