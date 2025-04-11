import { body } from 'express-validator';

export const changePasswordValidation = [
	body('currentPassword')
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
		.notEmpty().withMessage("Current password is required"),
	
	body('newPassword')
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
		.notEmpty().withMessage("Password must be at least 8 characters"),
]

export const updateUserValidation = [
	body('username')
		.notEmpty().withMessage("Username is required"),
	body('email')
		.notEmpty().withMessage("Please enter a valid email")
		.isEmail().withMessage("Please enter a valid email"),
	body('phone')
		.optional()
		.matches(/^\+?\d+$/).withMessage("Phone number must be numeric, optionally starting with '+'")
		.withMessage("Please enter a valid phone number")
]

export const addressValidation = [
	body('label')
		.notEmpty().withMessage('Please enter a label')
		.isLength({min:4}),
	body('recipientName')
		.notEmpty().withMessage('Please enter a recipientName')
		.isLength({min:3}),
	body('street')
		.notEmpty().withMessage('Please enter a street'),
	body('city')
		.notEmpty().withMessage('Please enter a city'),
	body('province')
		.notEmpty().withMessage('Please enter a province'),
	body('postalCode')
		.notEmpty().withMessage('Please enter a postalCode')
		.isNumeric().withMessage('Postal code must be numeric')
		.isLength({min:4}),
	body('phoneNumber')
		.notEmpty().withMessage('Please enter a phone number')
		.matches(/^\+?\d+$/).withMessage("Phone number must be numeric, optionally starting with '+'")
]

export const bankAccountValidation = [
	body('type')
		.notEmpty().withMessage('Please enter a type')
		.isIn(["bank", "e-wallet"]).withMessage('Type must be either "bank" or "e-wallet"'),
	body('provider')
		.notEmpty().withMessage('Please enter a provider'),
	body('accountName')
		.notEmpty().withMessage('Please enter a account name'),
	body('accountNumber')
		.notEmpty().withMessage('Please enter a account number')
		.isLength({min:10})
]