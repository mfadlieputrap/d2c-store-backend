jest.mock('../models/User.js');
import request from 'supertest';
import app from '../app.js';
import {beforeAll, jest} from '@jest/globals';
import User from "../models/User.js";
import {dummyUser, genToken} from "../utils/dummyHelper.js";

let token;

beforeAll(async ()=>{
	token = await genToken();
	User.findById = jest.fn().mockReturnValue({
		select: jest.fn().mockResolvedValue(dummyUser)
	});
	User.findByIdAndUpdate = jest.fn().mockResolvedValue({
		...dummyUser,
		username: 'updatedUser'
	})
	User.findByIdAndDelete = jest.fn().mockResolvedValue(dummyUser);
})



describe('User API', ()=>{
	it('update user success', async ()=>{
		const res = await request(app)
			.put('/api/user/update')
			.set('Authorization', `Bearer ${token}`)
			.send({ username: 'updatedUser'});
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message', 'User updated successfully');
		expect(res.body.user).toHaveProperty('username', 'updatedUser');
	})
	
	it('update user gagal tanpa token', async () => {
		const res = await request(app)
			.put('/api/user/update')
			.send({username: 'newName'});
		
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty('error'); // misalnya: "No token provided"
	});

	it('delete user success', async ()=>{
		const res = await request(app)
			.delete('/api/user/delete')
			.set('Authorization', `Bearer ${token}`)
		
		console.log(res.body);
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
	})

	it('change password success', async ()=>{
		
		
		const res = await request(app)
			.put('/api/user/change-password')
			.set('Authorization', `Bearer ${token}`)
			.send({
				currentPassword: 'Password123!',
				newPassword: 'passWord123!'
			})
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
	})
	
})