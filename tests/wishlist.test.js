import request from 'supertest';
import app from '../app.js';
import {beforeAll, expect, jest} from "@jest/globals";
import Wishlists from '../models/Wishlist.js';
import User from "../models/User.js";
import {dummyUser, dummyWishlistPopulated, dummyWishlistRaw, genToken} from "../utils/dummyHelper.js";

let token;

beforeAll(async()=>{
	token = await genToken();
	User.findById = jest.fn().mockResolvedValue(dummyUser);
	Wishlists.find = jest.fn((filter)=>{
		if(filter.userId === dummyWishlistRaw.userId){
			return {
				populate: jest.fn().mockResolvedValue(dummyWishlistPopulated)
			};
		}
		return {
			populate: jest.fn().mockResolvedValue([])
		};
	});
	Wishlists.findOne = jest.fn((filter)=>{
		if(filter.userId === '66294265e51dfd7c7d6a8d64' && filter.product === dummyWishlistRaw.product) {
			return Promise.resolve(dummyWishlistRaw)
		}
		return Promise.resolve(null);
	});
	Wishlists.create = jest.fn().mockResolvedValue(dummyWishlistRaw);
	Wishlists.findByIdAndDelete = jest.fn().mockResolvedValue(dummyWishlistRaw);
})

describe('Wishlist api', () => {
	it('Add product to wishlist', async () => {
		const res = await request(app)
			.post('/api/wishlists/add/')
			.set('Authorization', `Bearer ${token}`)
			.send({
				productId: '66294265e51dfd7c7d6a8c45'
			});
		
		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('status');
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('data');
	})
	
	it('Get wishlist by user id', async () => {
		console.log("mock wishlist");
		const res = await request(app)
			.get('/api/wishlists/')
			.set('Authorization', `Bearer ${token}`);
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('status');
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('data');
	});
	
	it('Delete product from wishlist', async () => {
		const res = await request(app)
			.delete('/api/wishlists/delete/66294265e51dfd7c7d6a8a49')
			.set('Authorization', `Bearer ${token}`);
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
	})
})