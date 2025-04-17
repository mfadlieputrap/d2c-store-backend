import User from '../models/User.js';
import mongoose from "mongoose";

const checkUserExists = async (req, res, next) => {
	try {
		const userId = req.user.id;
		
		if(!userId || !mongoose.Types.ObjectId.isValid(userId)){
			return res.status(401).json({ message: 'Invalid or missing user ID' });
		}
		
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		
		req.userData = user;
		
		next();
	} catch (e) {
		console.error("Error: ", e.message)
		return res.status(500).json({ error: e.message });
	}
};

export default checkUserExists;