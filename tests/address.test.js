import request from 'supertest';
import app from '../app.js';
import {beforeAll, jest, expect, describe} from '@jest/globals';
import Address from '../models/Address.js';
import User from '../models/User.js';
import {dummyAddress, dummyUser, genToken} from "../utils/dummyHelper.js";

let token;

beforeAll( async () => {
	token = await genToken();
	User.findById = jest.fn().mockResolvedValue(dummyUser);
	Address.find = jest.fn((filter) => {
		if(filter.userId === dummyUser._id){
			return {
				lean: jest.fn().mockResolvedValue(dummyAddress)
			}
		}
		return {
			lean: jest.fn().mockResolvedValue([])
		};
	})
	Address.findOne = jest.fn((filter) => {
		if(filter._id === dummyAddress[0]._id && filter.userId === dummyUser._id){
			return {
				lean: jest.fn().mockResolvedValue(dummyAddress)
			}
		}
		return {
			lean: jest.fn().mockResolvedValue([])
		};
	})
	Address.findOneAndUpdate = jest.fn().mockResolvedValue(dummyAddress);
	Address.create = jest.fn().mockResolvedValue(dummyAddress);
	Address.findOneAndDelete = jest.fn((filter)=>{
		if(filter.userId === dummyUser._id && filter._id === dummyAddress[0]._id){
			return Promise.resolve({});
		}
		return Promise.resolve({});
	});
})

describe('Address endpoints', () => {
	it("GET /api/address | Get all address by user id", async ()=>{
		const res = await request(app)
			.get('/api/address')
			.set('Authorization', `Bearer ${token}`);
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('addresses');
	})
	
	it("GET /api/address/:addressId | Get address by id", async ()=>{
		const res = await request(app)
			.get('/api/address/66294265e51dfd7c7d6a8c43')
			.set('Authorization', `Bearer ${token}`);
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('address');
	})
	
	it('GET /api/address/add | Add address', async ()=> {
		const res = await request(app)
			.post('/api/address/add')
			.set('Authorization', `Bearer ${token}`)
			.send({
				userId: dummyUser._id,
				label: 'Rumah',
				recipientName: 'Budi Santoso',
				street: 'Jalan Kenanga No. 12',
				city: 'Jakarta Selatan',
				province: 'DKI Jakarta',
				postalCode: '12345',
				phoneNumber: '081234567890'
			})
		
		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('address');
	})
	
	it('PUT /api/address/update/:addressId', async ()=>{
		const res = await request(app)
			.put('/api/address/update/66294265e51dfd7c7d6a8c43')
			.set('Authorization', `Bearer ${token}`)
			.send({
				label: 'kost'
			})
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('address');
	})
	
	it('DELETE /api/address/delete/:addressId', async ()=>{
		const res = await request(app)
			.delete('/api/address/delete/66294265e51dfd7c7d6a8c43')
			.set('Authorization', `Bearer ${token}`);
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
	})
})