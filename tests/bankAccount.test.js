import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import BankAccount from '../models/BankAccount.js';
import {jest, beforeAll, expect, describe} from '@jest/globals';
import {dummyBankAccount, dummyUser, genToken,} from "../utils/dummyHelper.js";

let token;

beforeAll(async ()=>{
	token = await genToken();
	User.findById = jest.fn().mockResolvedValue(dummyUser);
	BankAccount.find = jest.fn((filter)=>{
		if(filter.userId === dummyUser._id){
			return Promise.resolve(dummyBankAccount);
		}
	});
	BankAccount.findOne = jest.fn((filter)=>{
		console.log(filter);
		if(filter.userId === dummyBankAccount.userId && filter._id === dummyBankAccount._id){
			return Promise.resolve(dummyBankAccount);
		}
	})
	BankAccount.create = jest.fn().mockResolvedValue(dummyBankAccount);
	BankAccount.findOneAndDelete = jest.fn((filter)=>{
		if(filter._id === dummyBankAccount._id && filter.userId === dummyBankAccount.userId){
			return Promise.resolve(dummyBankAccount);
		}
	})
})

describe('Bank account endpoint', ()=>{
	it('GET /api/bank-accounts', async()=>{
		const res = await request(app)
			.get('/api/bank-accounts')
			.set('Authorization', `Bearer ${token}`);
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('bankAccounts');
	})
	
	it('GET /api/bank-accounts/:bankAccountId', async()=>{
		const res = await request(app)
			.get(`/api/bank-accounts/${dummyBankAccount._id}`)
			.set('Authorization',
				 `Bearer ${token}`);
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('bankAccount');
	})
	
	it('POST /api/bank-accounts/add', async()=>{
		const res = await request(app)
			.post('/api/bank-accounts/add')
			.set('Authorization', `Bearer ${token}`)
			.send({
				type: 'bank',
				provider: 'BCA',
				accountName: 'John Doe',
				accountNumber: '1234567890',
				createdAt: new Date(),
				updatedAt: new Date(),
			})
		
		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('bankAccount');
	})
	
	it('PUT /api/bank-accounts/update/:bankAccountId', async ()=>{
		const res = await request(app)
			.put(`/api/bank-accounts/update/${dummyBankAccount._id}`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				accountName: 'Chin Doe'
			})
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('bankAccount');
	})
	
	it('DELETE /api/bank-accounts/delete/:bankAccountId', async()=>{
		const res = await request(app)
			.delete(`/api/bank-accounts/delete/${dummyBankAccount._id}`)
			.set('Authorization', `Bearer ${token}`);
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('result');
	})
})