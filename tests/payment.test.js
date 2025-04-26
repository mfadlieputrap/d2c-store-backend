import request from 'supertest';
import app from '../app.js';
import {jest, beforeAll, expect} from '@jest/globals';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import {genToken, dummyOrderRaw, dummyPaymentRaw, dummyPaymentPopulate, dummyProductRaw} from '../utils/dummyHelper.js';

let customerToken;
let adminToken;

beforeAll(async () => {
	customerToken = await genToken();
	adminToken = await genToken(true);
	Order.findById = jest.fn().mockResolvedValue(dummyOrderRaw);
	Order.findByIdAndUpdate = jest.fn().mockResolvedValue(dummyOrderRaw);
	Payment.findOne = jest.fn().mockResolvedValue(null);
	Payment.create = jest.fn().mockResolvedValue(dummyPaymentRaw);
	Payment.find = jest.fn().mockReturnValue({
		populate: jest.fn().mockResolvedValue(dummyPaymentPopulate)
	});
	Payment.findOneAndUpdate = jest.fn((filter)=>{
		if(filter.order === dummyPaymentRaw.order){
			return Promise.resolve(dummyPaymentRaw)
		}
	});
	Payment.findOneAndDelete = jest.fn((filter)=>{
		if(filter.order === dummyPaymentRaw.order){
			return Promise.resolve(dummyPaymentRaw)
		}
	});
})

describe('payment methods', () => {
	it('POST /api/payments/create', async ()=> {
		const res = await request(app)
			.post('/api/payments/create')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				orderId: dummyOrderRaw._id,
				paymentType: 'bank_transfer',
				transactionStatus: 'settlement',
				transactionId: 'tx-1713858965123',
				paymentResult: '66294265e51dfd7c7d6a8c22',
				paidAt: new Date()
			})
		
		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('payment');
	})
	
	it('GET /api/payments/:orderId', async ()=> {
		Payment.findOne = jest.fn().mockResolvedValue(dummyProductRaw);
		const res = await request(app)
			.get('/api/payments/66294265e51dfd7c7d6a8d42')
			.set('Authorization', `Bearer ${customerToken}`);
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('payment');
	})
	
	it('GET /api/payments/', async ()=>{
		const res = await request(app)
			.get('/api/payments/')
			.set('Authorization', `Bearer ${adminToken}`);
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('payments');
	})
	
	it('PUT /api/payments/:orderId/status', async ()=>{
		const res = await request(app)
			.put(`/api/payments/${dummyOrderRaw._id}/status`)
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				transactionStatus: 'settlement',
			})
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('payment')
	})
	
	it('POST /api/payments/midtrans/callback', async ()=> {
		const res = await request(app)
			.post('/api/payments/midtrans/callback')
			.send({
				order_id: dummyOrderRaw._id,
				transaction_status: 'settlement',
				transaction_id: dummyPaymentRaw.transactionId
			})
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('payment');
	})
	
	it('DELETE /api/payments/delete', async ()=>{
		const res = await request(app)
			.delete(`/api/payments/delete/${dummyOrderRaw._id}`)
			.set('Authorization', `Bearer ${adminToken}`);
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
	})
})