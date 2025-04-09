import { body } from 'express-validator';

export const registerValidation = [
	body('username')
		.notEmpty().withMessage("Username is required"),
	
	body('email')
		.notEmpty().withMessage("Please enter a valid email"),
	
	body('password')
		.notEmpty().withMessage("Password must be at least 8 characters"),
	
	body('phone')
		.optional()
		.withMessage("Please enter a valid phone number"),
]

export const loginValidation = [
	body('email')
		.notEmpty().withMessage("Email is required & please enter a valid email"),
	
	body('password')
		.notEmpty().withMessage("Password must be at least 8 characters"),
]

export const changePasswordValidation = [
	body('currentPassword')
		.notEmpty().withMessage("Current password is required"),
	
	body('newPassword')
		.notEmpty().withMessage("Password must be at least 8 characters"),
]