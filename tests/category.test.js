import request from 'supertest';
import app from '../app.js';
import Category from '../models/Category.js';
import {jest, beforeAll, expect, describe} from '@jest/globals';
import {genToken, dummyCategory, dummyUser} from "../utils/dummyHelper.js";
import User from "../models/User.js";

let token;

beforeAll(async ()=>{
	token = await genToken(true);
	User.findById = jest.fn().mockResolvedValue(dummyUser);
	Category.findOne = jest.fn((filter)=>{
		if(filter.name === 'outerwear'){
			return Promise.resolve(dummyCategory);
		}
		return Promise.resolve(null);
	})
	Category.findById = jest.fn().mockResolvedValue(dummyCategory);
	Category.create = jest.fn().mockResolvedValue(dummyCategory);
	Category.find = jest.fn().mockResolvedValue([dummyCategory]);
	Category.findByIdAndUpdate = jest.fn().mockResolvedValue(dummyCategory);
	Category.findByIdAndDelete = jest.fn().mockResolvedValue(dummyCategory);
})

describe('Category endpoints', ()=>{
	it('POST /api/categories/add', async ()=>{
		const res = await request(app)
			.post('/api/categories/add')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'T-Shirts',
				parent: null
			})
		
		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('category');
	})
	
	it('GET /api/categories/', async ()=>{
		const res = await request(app)
			.get('/api/categories/')
			.set('Authorization', `Bearer ${token}`);
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('categories');
	})
	
	it('PUT /api/categories/update/:id', async ()=>{
		const  res = await request(app)
			.put(`/api/categories/update/${dummyCategory._id}`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'Topwear'
			})
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('category');
	})
	
	it('DELETE /api/categories/delete/:id', async()=>{
		const res = await request(app)
			.delete(`/api/categories/delete/${dummyCategory._id}`)
			.set('Authorization', `Bearer ${token}`);
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
	});
})