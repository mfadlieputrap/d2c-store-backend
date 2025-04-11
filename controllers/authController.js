import { validationResult } from "express-validator";
import User from '../models/User.js';
import generateToken from "../utils/generateToken.js";
import hashPassword from "../utils/hashPassword.js";
import comparePassword from "../utils/comparePassword.js";

export const registerUser = async (req, res) => {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(400).send({ errors: errors.array() });
	}
	const { username, email, password } = req.body;
	try {
		const existingUser = await User.findOne({$or: [{email}, {username}]});
		if(existingUser) {
			return res.status(400).json({ message: "Email or Username already in use" });
		}
		
		const hashedPassword = await hashPassword(password);
		
		await User.create({
			username,
			email,
			password: hashedPassword,
		})
		
		return res.status(201).json({ message: "User registered successfully" });
	} catch (e) {
		return res.status(500).json({ errors: e.message});
	}
}

export const loginUser = async (req, res)=>{
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	const { email, password } = req.body;
	try {
	  const existingUser = await User.findOne({email});
		if(!existingUser){
			return res.status(404).json({ message: "User does not exist" });
		}
		
		const isPasswordValid = await comparePassword(password, existingUser.password);
		if(!isPasswordValid){
			return res.status(401).json({ message: "Invalid Password" });
		}
		
		const token = generateToken(existingUser);
		
		return res.status(200).json({ message: "User login successfully", token });
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
}