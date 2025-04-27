import User from '../models/User.js';
import checkUserExists from "../utils/checkUserExists.js";
import comparePassword from "../utils/comparePassword.js";
import hashPassword from "../utils/hashPassword.js";
import {validationResult} from "express-validator";
import {responseFormat} from "../utils/responseHelper.js";

export const updateUser = async (req, res) => {
	try {
		const updateData = req.body;
		const updatedData = await User.findByIdAndUpdate(req.user.id,{
			$set: updateData,
		}, { new: true, runValidators: true });
		
		return responseFormat(res, 200, 'User updated successfully', { user: updatedData});
	} catch (e) {
		return responseFormat(res, 500, e.message);
	}
}

export const getProfile = async (req, res) => {
	try{
		const user = req.userData;
		
		return responseFormat(res, 200, 'User profile retrieved', user);
	}catch(e){
		console.error('[GET PROFILE ERROR] ', e.message);
		return responseFormat(res, 500, e.message);
	}
}

export const deleteProfile = async (req, res) => {
	try{
		const result = await User.findByIdAndDelete(req.user.id);
		
		return responseFormat(res, 200, 'Profile deleted successfully', result);
	}catch(e){
		console.error('[DELETE PROFILE] ', e.message);
		return responseFormat(res, 500, e.message);
	}
}

export const changePassword = async (req, res) => {
	try{
		const { currentPassword, newPassword } = req.body;
		const user = await User.findById(req.user.id).select('+password');
		const isPasswordValid = await comparePassword(currentPassword, user.password);
		if(!isPasswordValid){
			return responseFormat(res, 401, 'Invalid Password');
		}
		user.password = await hashPassword(newPassword);
		await user.save();
		
		return responseFormat(res, 200, 'Change password successfully');
	}catch(e){
		console.error("[CHANGE PASSWORD ERROR] ", e.message);
		return responseFormat(res, 500, e.message);
	}
}