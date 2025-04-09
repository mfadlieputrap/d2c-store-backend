import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	username:{
		type: String,
		required: true,
		unique: true,
	},
	email:{
		type: String,
		required: true,
		unique: true,
	},
	password:{
		type: String,
		required: true,
	},
	phone:{
		type: String,
	},
	role:{
		type: String,
		enum: ['customer'],
		default: 'customer'
	}
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;