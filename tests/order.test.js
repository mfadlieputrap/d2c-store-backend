import request from 'supertest';
import app from '../app.js';
import { beforeAll, jest, expect} from "@jest/globals";
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import {
	dummyUser,
	genToken,
	dummyOrderRaw,
	dummyOrderPopulate,
	dummyProductRaw,
	midtransPayload, dummyAddress
} from "../utils/dummyHelper.js";
import Product from "../models/Product.js";
import snap from "../utils/midtrans.js";
import Address from "../models/Address.js";
import User from "../models/User.js";

let customerToken;
let adminToken;

beforeAll(async ()=>{
	customerToken = await genToken();
	adminToken = await genToken(true);
	User.findById = jest.fn().mockResolvedValue(dummyUser);
	Address.findOne = jest.fn().mockResolvedValue(dummyAddress);
	Product.findById = jest.fn().mockResolvedValue(dummyProductRaw);
	snap.createTransaction = jest.fn().mockResolvedValue(midtransPayload);
	Order.findById = jest.fn().mockReturnValue({
		populate: jest.fn().mockReturnValue({
			populate: jest.fn().mockReturnValue({
				populate: jest.fn().mockResolvedValue(dummyOrderPopulate)
			})
		})
	})
	Order.findOne = jest.fn().mockResolvedValue(dummyOrderRaw);
	Order.find = jest.fn((filter)=>{
		if(filter && filter.userId === dummyUser._id){
			return {
				populate: jest.fn().mockReturnValue({
					populate: jest.fn().mockReturnValue({
						populate: jest.fn().mockResolvedValue(dummyOrderPopulate)
					})
				})
			}
		}
		return {
			populate: jest.fn().mockReturnValue({
				populate: jest.fn().mockReturnValue({
					populate: jest.fn().mockResolvedValue(dummyOrderPopulate)
				})
			})
		}
	});
	Order.create = jest.fn().mockResolvedValue(dummyOrderRaw);
	Order.findByIdAndUpdate = jest.fn().mockResolvedValue(dummyOrderRaw);
})

describe("Order endpoints", ()=>{
	it('POST /api/orders/create', async ()=>{
		const res = await request(app)
			.post('/api/orders/create')
			.set('Authorization', `Bearer ${customerToken}`)
			.send({
				userId: dummyUser._id,
				items: [
					{
						productId: dummyProductRaw._id,
						variant: {
							color: 'Full Black',
							size: '60%',
						},
						quantity: 2,
						price: 178000
					}
				],
				shippingAddress: dummyAddress[0]._id,
				paymentMethod: 'bank_transfer',
				totalPrice: 600000,
				status: 'pending',
				isPaid: false
			})
		
		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('status');
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('data');
		expect(res.body.data).toHaveProperty('order');
		expect(res.body.data).toHaveProperty('snapToken');
	}, 15000)
	
	it('GET /api/orders/', async ()=>{
		const res = await request(app)
			.get('/api/orders/')
			.set('Authorization', `Bearer ${adminToken}`)
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('status');
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('data');
	})
	
	it('GET /api/orders/me', async ()=>{
		const res = await request(app)
			.get('/api/orders/me')
			.set('Authorization', `Bearer ${customerToken}`);
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('status');
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('data');
	})
	
	it('GET /api/orders/:orderId', async ()=>{
		const res = await request(app)
			.get('/api/orders/66294265e51dfd7c7d6a8d42')
			.set('Authorization', `Bearer ${customerToken}`);
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('status');
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('data');
	})
	
	it('PUT /api/orders/status', async ()=>{
		const res = await request(app)
			.put('/api/orders/status/66294265e51dfd7c7d6a8d42')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				status: 'paid'
			})
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('status');
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('data');
	})
	
	it('PUT /api/orders/cancel/:orderId', async ()=>{
		const res = await request(app)
			.put('/api/orders/cancel/66294265e51dfd7c7d6a8d42')
			.set('Authorization', `Bearer ${customerToken}`)
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('status');
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('data');
	})
})