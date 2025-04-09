import mongoose from 'mongoose';

const bankAccountSchema = new mongoose.Schema({
	userId:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	type:{
		type: String,
		enum: ['bank', 'e-wallet'],
		required: true
	},
	provider:{
		type: String,
		required: true
	},
	accountName:{
		type: String,
		required: true
	},
	accountNumber:{
		type: String,
		required: true
	}
}, { timestamps: true });

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);
export default BankAccount;