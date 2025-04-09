import User from '../models/User.js';

const checkUserExists = async (userId) => {
	const user = await User.findById(userId).select("-password");
	if(!user){
		const error = new Error('User not found');
		error.status = 404;
		throw error;
	}
	return user;
};

export default checkUserExists;