import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
	orderId:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Order',
		required: true,
		unique: true
	},
	paymentType:{
		type: String,
		required: true
	},
	transactionStatus:{
		type: String,
		enum: ['pending', 'settlement', 'deny', 'cancel', 'expire', 'failure'],
		required: true
	},
	transactionId:{
		type: String,
		required: true,
		unique: true
	},
	paymentResult:{
		type: mongoose.Schema.Types.ObjectId,
		default: {}
	},
	paidAt:{
		type: Date
	}
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;