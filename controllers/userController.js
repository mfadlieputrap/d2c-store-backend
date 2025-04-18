import User from '../models/User.js';
import checkUserExists from "../utils/checkUserExists.js";
import comparePassword from "../utils/comparePassword.js";
import hashPassword from "../utils/hashPassword.js";
import {validationResult} from "express-validator";

export const updateUser = async (req, res) => {
	try {
		const updateData = req.body;
		const updatedData = await User.findByIdAndUpdate(req.user.id,{
			...updateData,
		}, { new: true, runValidators: true });
		
		return res.status(200).json({
			message: "User updated successfully",
			user: updatedData
		})
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
}

export const getProfile = async (req, res) => {
	try{
		const user = req.userData;
		
		return res.status(200).json({ message: "User profile retrieved", user});
	}catch(e){
		return res.status(500).json({ error: e.message });
	}
}

export const deleteProfile = async (req, res) => {
	try{
		const result = await User.findByIdAndDelete(req.user.id);
		
		return res.status(200).json({
			message: "Profile deleted successfully",
			result
		})
	}catch(e){
		return res.status(500).json({ error: e.message });
	}
}

export const changePassword = async (req, res) => {
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		return res.status(400).json({ errors: errors.array() });
	}
	try{
		const { currentPassword, newPassword } = req.body;
		const user = await User.findById(req.user.id).select('+password');
		const isPasswordValid = await comparePassword(currentPassword, user.password);
		if(!isPasswordValid){
			return res.status(401).json({ message: "Invalid password" });
		}
		user.password = await hashPassword(newPassword);
		await user.save();
		
		return res.status(200).json({ message: "Change password successfully" });
	}catch(e){
		console.error("Error: ", e.message);
		return res.status(500).json({ error: e.message });
	}
}