
import User from '../models/User.js';
import generateToken from "../utils/generateToken.js";
import hashPassword from "../utils/hashPassword.js";
import comparePassword from "../utils/comparePassword.js";
import {responseFormat} from "../utils/responseHelper.js";

export const registerUser = async (req, res) => {
	const { username, email, password } = req.body;
	try {
		const existingUser = await User.findOne({$or: [{email}, {username}]});
		if(existingUser) {
			return responseFormat(res, 400, "Email or Username already in use");
		}
		
		const hashedPassword = await hashPassword(password);
		
		await User.create({
			username,
			email,
			password: hashedPassword,
		})
		
		return responseFormat(res, 201, "User registered successfully");
	} catch (e) {
		console.error('[REGISTER ERROR] ', e.message);
		return responseFormat(res, 500, error.message);
	}
}

export const loginUser = async (req, res)=>{

	const { email, password } = req.body;
	try {
	  const existingUser = await User.findOne({email}).select("+password");
		if(!existingUser){
			return responseFormat(res, 404, "User doesn't exists");
		}
		console.log(password, existingUser.password);
		const isPasswordValid = await comparePassword(password, existingUser.password);
		if(!isPasswordValid){
			return responseFormat(res, 400, "Invalid password");
		}
		
		const token = generateToken(existingUser);
		
		return responseFormat(res, 200, "user login successfully", token);
	} catch (e) {
		console.error('[LOGIN ERROR] ', e.message);
		return responseFormat(res, 500, error.message);
	}
}