import request from 'supertest';
import app from '../app.js';
import jwt from 'jsonwebtoken';
import {beforeAll, jest} from '@jest/globals';
import dotenv from 'dotenv';
import bcrypt from "bcrypt";
import User from "../models/User.js";
dotenv.config();
jest.mock('../models/User.js');

let dummyUser;
let token;
beforeAll(async ()=>{
	dummyUser = {
		_id: '66294265e51dfd7c7d6a8d94',
		username: 'mockuser',
		email: 'mock@example.com',
		password: await bcrypt.hash('Password123!', 10),
		save: jest.fn().mockResolvedValue(true)
	};
	token = jwt.sign({
		id: dummyUser._id,
		role: 'customer'
	}, process.env.JWT_SECRET, { expiresIn: '3h' });
	console.log("Secret:", process.env.JWT_SECRET);
	User.findById = jest.fn();
	User.findByIdAndUpdate = jest.fn();
	User.findByIdAndDelete = jest.fn();
})



describe('User API', ()=>{
	it('update user success', async ()=>{
		User.findById.mockReturnValue({
			select: jest.fn().mockResolvedValue(dummyUser)
		});
		User.findByIdAndUpdate.mockResolvedValue({
			...dummyUser,
			username: 'updatedUser'
		})
		
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
		User.findById.mockReturnValue({
			select: jest.fn().mockResolvedValue(dummyUser)
		});
		User.findByIdAndDelete.mockResolvedValue(dummyUser);
		const res = await request(app)
			.delete('/api/user/delete')
			.set('Authorization', `Bearer ${token}`)
		
		console.log(res.body);
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
	})

	it('change password success', async ()=>{
		User.findById.mockReturnValue({
			select: jest.fn().mockResolvedValue(dummyUser)
		});
		
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