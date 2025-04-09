import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
	userId:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	items:[
		{
			productId:{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product',
				required: true
			},
			variant:{
				color: String,
				size: String
			},
			quantity:{
				type: Number,
				required: true,
				min: 1
			},
			price:{
				type: Number,
				required: true
			}
		}
	],
	shippingAddress:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Address',
		required: true
	},
	paymentMethod:{
		type: String,
		required: true
	},
	totalPrice:{
		type: Number,
		required: true
	},
	status:{
		type: String,
		enum: ['pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'],
		default: 'Pending',
	},
	isPaid:{
		type: Boolean,
		default: false
	},
	paidAt:{
		type: Date
	},
	shippedAt:{
		type: Date
	},
	completedAt:{
		type: Date
	},
	cancelledAt:{
		type: Date
	}
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;