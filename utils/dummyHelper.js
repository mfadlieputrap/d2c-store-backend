import bcrypt from "bcrypt";
import {jest} from "@jest/globals";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const dummyUser = {
	_id: '66294265e51dfd7c7d6a8d94',
	username: 'mockuser',
	email: 'mock@example.com',
	password: await bcrypt.hash('Password123!', 10),
	save: jest.fn().mockResolvedValue(true)
}

export const genToken = async (forAdmin = false)=>{
	return await jwt.sign({ id: dummyUser._id, role: forAdmin? 'admin':'customer' }, process.env.JWT_SECRET, { expiresIn: "2h"});
}

export const dummyProductRaw = {
	_id: "66294265e51dfd7c7d6a8c45",
	name: "Keyboard Gaming",
	description: "Keyboard gaming with RGB backlight and red Switch",
	detail: "Keyboard gaming compact 60% with backlight RGB and red switch hotswap",
	variants:[{
		color: "Full Black",
		sizes: [{
			size: "60%",
			stock: 300,
			price: 178000
		}]
	}],
	images: "keyboard-gaming.jpg",
	category: "66294265e51dfd7c7d6a8c96",
	save: jest.fn().mockResolvedValue(true)
}

export const dummyProductPopulated = {
	...dummyProductRaw,
	category: {
		_id: "66294265e51dfd7c7d6a8c96",
		name: "Keyboard"
	}
}

export const dummyAddress = [{
	_id: '66294265e51dfd7c7d6a8c43',
	userId: dummyUser._id,
	label: 'Rumah',
	recipientName: 'Budi Santoso',
	street: 'Jalan Kenanga No. 12',
	city: 'Jakarta Selatan',
	province: 'DKI Jakarta',
	postalCode: '12345',
	phoneNumber: '081234567890',
	save: jest.fn().mockResolvedValue(true)
}]

export const dummyCartRaw = {
	_id: '66294265e51dfd7c7d6a8c84',
	userId: dummyUser._id,
	variant:{
		color: "Full Black",
		size: "60%"
	},
	quantity: 2,
	product: dummyProductRaw._id,
	save: jest.fn().mockResolvedValue(true)
}

export const dummyCartPopulated = {
	...dummyCartRaw,
	product:{
		_id: '66294265e51dfd7c7d6a8a49',
		name: dummyProductRaw.name,
		variants: [{
			color: "Full Black",
			size: "60%",
			stock: 300,
			price: 178000
		}]
	}
}

export const dummyWishlistRaw = {
	_id: '66294265e51dfd7c7d6a8a49',
	userId: '66294265e51dfd7c7d6a8d94',
	product: '66294265e51dfd7c7d6a8c45'
};

export const dummyWishlistPopulated = {
	...dummyWishlistRaw,
	product:{
		_id: '66294265e51dfd7c7d6a8c45',
		name: 'Keyboard Gaming',
		variants:[{
			price: 178000
		}]
	}
}


export const dummyOrderRaw = {
	_id: '66294265e51dfd7c7d6a8d42',
	userId: dummyUser._id,
	items: [
		{
			productId: dummyProductRaw._id,
			variant: {
				color: 'black',
				size: 'M',
			},
			quantity: 2,
			price: 300000
		}
	],
	shippingAddress: dummyAddress[0]._id,
	paymentMethod: 'bank_transfer',
	totalPrice: 600000,
	status: 'pending',
	isPaid: false,
	createdAt: new Date(),
	updatedAt: new Date(),
	save: jest.fn().mockResolvedValue(true)
};

export const dummyOrderPopulate = {
	...dummyOrderRaw,
	userId: {
		_id: dummyOrderRaw.userId,
		username: 'testuser',
		email: 'test@example.com',
	},
	shippingAddress: {
		_id: dummyOrderRaw.shippingAddress,
		addressLine: 'Jl. Testing No.1',
		city: 'Jakarta',
		postalCode: '12345',
		province: 'DKI Jakarta',
		phone: '08123456789',
	},
	items: [
		{
			...dummyOrderRaw.items[0],
			productId: {
				_id: dummyOrderRaw.items[0].productId,
				name: 'Kaos Polos',
				slug: 'kaos-polos',
			}
		}
	]
};

export const midtransPayload = {
	transaction_detail:{
		order_id: `${dummyOrderRaw._id.toString()}-${Date.now()}`,
		gross_amount: 150000
	},
	customer_details:{
	
	},
	token: 'dummy-snap-token'
};

export const dummyPaymentRaw = {
	_id: '66294265e51dfd7c7d6a8c26',
	order: dummyOrderRaw._id,
	paymentType: 'bank_transfer',
	transactionStatus: 'settlement',
	transactionId: 'tx-1713858965123',
	paymentResult: '66294265e51dfd7c7d6a8c22',
	paidAt: new Date()
}

export const dummyPaymentPopulate = {
	...dummyPaymentRaw,
	order: {
		...dummyOrderRaw
	}
}
export const dummyBankAccount = {
	_id: '661f3e31d4f2a1b7c4567890',
	userId: dummyUser._id,
	type: 'bank',
	provider: 'BCA',
	accountName: 'John Doe',
	accountNumber: '1234567890',
	createdAt: new Date(),
	updatedAt: new Date(),
	save: jest.fn().mockResolvedValue(true)
};

export const dummyCategory = {
	_id: '6600aaaaaabbbbbccccdddd',
	name: 'T-Shirts',
	slug: 't-shirts',
	parent: null,
	createdAt: new Date(),
	updatedAt: new Date()
};