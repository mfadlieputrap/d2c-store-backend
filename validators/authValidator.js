import { body } from 'express-validator';

export const registerValidation = [
	body('username')
		.notEmpty().withMessage("Username is required"),
	
	body('email')
		.notEmpty().withMessage("Please enter a valid email")
		.isEmail().withMessage("Please enter a valid email"),
	
	body('password')
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
		.notEmpty().withMessage("Password must be at least 8 characters"),
	
	body('phone')
		.optional()
		.matches(/^\+?\d+$/).withMessage("Phone number must be numeric, optionally starting with '+'")
		.withMessage("Please enter a valid phone number"),
]

export const loginValidation = [
	body('email')
		.notEmpty().withMessage("Email is required & please enter a valid email")
		.isEmail().withMessage("Please enter a valid email"),
	
	body('password')
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
		.notEmpty().withMessage("Password must be at least 8 characters"),
]

