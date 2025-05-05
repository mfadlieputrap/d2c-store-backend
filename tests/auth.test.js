import {expect, jest} from '@jest/globals';
import User from '../models/User.js';
import bcrypt from "bcrypt";
import request from 'supertest';
import app from '../app.js';
import {dummyUser} from  '../utils/dummyHelper.js';
import {body} from "express-validator";



beforeAll(async () => {
	
	User.findOne = jest.fn();
	User.create = jest.fn();
})




describe('Auth tanpa DB (mock)', ()=>{
	it('register user successfully', async ()=>{
		User.findOne.mockResolvedValue(null);
		User.create.mockResolvedValue(dummyUser);
		
		const res = await request(app)
			.post('/api/auth/register')
			.send({
				username: dummyUser.username,
				email: dummyUser.email,
				password: 'Password123!'
			});
		
		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('status');
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('data');
	})
	
	it('login user successfully', async ()=>{
		User.findOne.mockReturnValue({
			select: jest.fn().mockResolvedValue(dummyUser)
		});
		
		const res = await request(app)
			.post('/api/auth/login')
			.send({
				email: dummyUser.email,
				password: 'Password123!',
			});
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('status');
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('data');
	})
})