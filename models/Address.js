import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
	userId:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	label:{
		type: String,
		required: true
	},
	recipientName:{
		type: String,
		required: true
	},
	street:{
		type: String,
		required: true
	},
	city:{
		type: String,
		required: true
	},
	province:{
		type: String,
		required: true
	},
	postalCode:{
		type: String,
		required: true
	},
	phoneNumber:{
		type: String,
		required: true
	}
}, { timestamps: true });

const Address = mongoose.model('Address', addressSchema);
export default Address;