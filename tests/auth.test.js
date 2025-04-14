import {jest} from '@jest/globals';
import User from '../models/User.js';
import bcrypt from "bcrypt";
import request from 'supertest';
import app from '../app.js';
jest.mock('../models/User.js');


let dummyUser;

beforeAll(async () => {
	dummyUser = {
		_id: 'fakeid123',
		username: 'mockuser',
		email: 'mock@example.com',
		password: await bcrypt.hash('Password123!', 10)
	};
	
	User.findOne = jest.fn();
	User.create = jest.fn();
})




describe('Auth tanpa DB (mock)', ()=>{
	it('register user successfully', async ()=>{
		console.log(User.findOne);
		User.findOne.mockResolvedValue(null);
		User.create.mockResolvedValue(dummyUser);
		
		const res = await request(app)
			.post('/api/auth/register')
			.send({
				username: dummyUser.username,
				email: dummyUser.email,
				password: 'Password123!'
			});
		
		console.log(res.body);
		
		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('message');
	})
	
	it('login user successfully', async ()=>{
		User.findOne.mockResolvedValue(dummyUser);
		
		const res = await request(app)
			.post('/api/auth/login')
			.send({
				email: dummyUser.email,
				password: 'Password123!',
			});
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('token');
	})
})