import { body, param} from 'express-validator';
import mongoose from "mongoose";
import {mongoIdValidator} from "../utils/customValidators.js";

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
		.optional()
		.notEmpty().withMessage("Username is required"),
	body('email')
		.optional()
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

export const bankAccountValidation = (isUpdate = false) => [
	body('type')
		.if(()=> !isUpdate)
		.notEmpty().withMessage('Please enter a type')
		.isIn(["bank", "e-wallet"]).withMessage('Type must be either "bank" or "e-wallet"'),
	body('provider')
		.if(()=> !isUpdate)
		.notEmpty().withMessage('Please enter a provider'),
	body('accountName')
		.if(()=> !isUpdate)
		.notEmpty().withMessage('Please enter an account name'),
	body('accountNumber')
		.if(()=> !isUpdate)
		.notEmpty().withMessage('Please enter an account number')
		.isLength({min:10})
]

export const cartValidation = [
	body('product')
		.notEmpty().withMessage('Product id is required')
		.custom((value)=> mongoose.Types.ObjectId.isValid(value))
		.withMessage('Invalid Product ID format'),
	body('variant.color')
		.trim()
		.notEmpty().withMessage('Variant color is required')
		.isString().withMessage('Color must be a string'),
	body('variant.size')
		.trim()
		.notEmpty().withMessage('Variant size is required')
		.isString().withMessage('Size must be a string'),
	body('quantity')
		.notEmpty().withMessage('Quantity is required')
		.isInt({ min: 1}).withMessage('Quantity must be a positive integer'),
]

export const updateQuantityValidation = [
	body('newQuantity')
		.notEmpty().withMessage('Quantity is required')
		.isInt({ min:1}).withMessage('Quantity must be a positive integer')
]

export const productValidation = (isUpdate = false) => [
	body('name')
		.if(()=> !isUpdate)
		.notEmpty().withMessage('Name is required')
		.optional({ checkFalsy: true }),
	
	body('description')
		.if(()=> !isUpdate)
		.notEmpty().withMessage('Description is required')
		.optional({ checkFalsy: true }),
	
	body('detail')
		.if(()=> !isUpdate)
		.notEmpty().withMessage('Detail is required')
		.optional({ checkFalsy: true }),
	
	body('images')
		.if(()=> !isUpdate)
		.isArray({ min: 1 }).withMessage('At least one image is required')
		.optional({ checkFalsy: true }),
	
	body('images.*')
		.optional({ checkFalsy: true })
		.isURL().withMessage('Each image must be a valid URL')
		.matches(/\.(jpg|jpeg|png|webp)$/i).withMessage('Image must be jpg, jpeg, png, or webp'),
	
	body('variants')
		.if(()=> !isUpdate)
		// .if((value, { req }) => !isUpdate || req.body.variants)
		.isArray({ min: 1 }).withMessage('Variants must be a non-empty array')
		.optional({ checkFalsy: true }),
	
	body('variants.*.price')
		.if(()=> !isUpdate)
		// .if((value, { req }) => !isUpdate || req.body.variants)
		.isFloat({ gt: 0 }).withMessage('Each variant price must be greater than 0')
		.optional({ checkFalsy: true }),
	
	body('variants.*.stock')
		.if(()=> !isUpdate)
		// .if((value, { req }) => !isUpdate || req.body.variants)
		.isInt({ gt: 0 }).withMessage('Each variant stock must be greater than 0')
		.optional({ checkFalsy: true }),
	
	body('variants.*.color')
		.optional({ checkFalsy: true })
		// .if((value, { req }) => !isUpdate || req.body.variants)
		.notEmpty().withMessage('Color is required in variants'),
		
	
	body('variants.*.size')
		.if(()=> !isUpdate)
		// .if((value, { req }) => !isUpdate || req.body.variants)
		.notEmpty().withMessage('Size is required in variants')
		.optional({ checkFalsy: true }),
];

export const categoryValidation = (isUpdate = false) => [
	body('name')
		.if(()=> !isUpdate)
		.notEmpty().withMessage('Name is required')
		.optional({ checkFalsy: true }),
	
	body('parent')
		.optional({ checkFalsy: true })
		.custom((val) => mongoose.Types.ObjectId.isValid(val)).withMessage(`parent is not a valid MongoDB ObjectId`)
]

export const createPaymentValidation = [
	body('orderId')
		.notEmpty().withMessage('Order ID is required')
		.isMongoId().withMessage('Invalid Order ID format'),
	
	body('paymentType')
		.notEmpty().withMessage('Payment type is required')
		.isString().withMessage('Payment type must be a string'),
	
	body('transactionStatus')
		.notEmpty().withMessage('Transaction status is required')
		.isIn(['pending', 'settlement', 'cancel', 'expire', 'deny', 'failure'])
		.withMessage('Invalid transaction status'),
	
	body('transactionId')
		.notEmpty().withMessage('Transaction ID is required')
		.isString().withMessage('Transaction ID must be a string'),
	
	body('paymentResult')
		.optional()
		.isObject().withMessage('Payment result must be an object'),
	
	body('paidAt')
		.optional()
		.isISO8601().withMessage('Invalid paidAt date format')
];

export const updatePaymentStatusValidation = [
	param('orderId')
		.notEmpty().withMessage('Order ID is required')
		.isMongoId().withMessage('Invalid Order ID format'),
	
	body('transactionStatus')
		.notEmpty().withMessage('Transaction status is required')
		.isIn(['pending', 'settlement', 'cancel', 'expire', 'deny', 'failure'])
		.withMessage('Invalid transaction status')
];

export const getPaymentByOrderIdValidation = [
	param('orderId')
		.notEmpty().withMessage('Order ID is required')
		.isMongoId().withMessage('Invalid Order ID format')
];
