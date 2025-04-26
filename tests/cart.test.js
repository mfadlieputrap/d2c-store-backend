import request from 'supertest';
import app from '../app.js';
import {beforeAll, jest, expect} from '@jest/globals';
import Cart from '../models/Cart.js';
import User from "../models/User.js";
import Product from "../models/Product.js";
import {dummyProductRaw, dummyUser, dummyCartRaw, dummyCartPopulated, genToken} from "../utils/dummyHelper.js";

let token;

beforeAll(async () => {
	token = await genToken();
	User.findById = jest.fn().mockResolvedValue(dummyUser);
	Product.findById = jest.fn().mockReturnValue({
		lean: jest.fn().mockResolvedValue(dummyProductRaw)
	})
	Cart.findOne = jest.fn((filter)=>{
		if(
			filter.userId !== dummyUser._id &&
			filter.product === dummyProductRaw._id &&
			filter["variant.color"] === dummyCartRaw.variant.color &&
			filter["variant.size"] === dummyCartRaw.variant.size){
			return Promise.resolve(dummyCartRaw);
		}
		return Promise.resolve(null);
	})
	Cart.find = jest.fn().mockReturnValue({
		sort: jest.fn().mockReturnValue({
			populate: jest.fn().mockReturnValue({
				lean: jest.fn().mockResolvedValue([dummyCartPopulated])
			})
		})
	})
	Cart.findById = jest.fn().mockResolvedValue(dummyCartRaw);
	Cart.create = jest.fn().mockResolvedValue(dummyCartRaw);
	Cart.findOneAndDelete = jest.fn((filter)=>{
		if(filter.userId === dummyUser._id && filter._id === dummyCartRaw._id){
			return Promise.resolve(dummyCartRaw);
		}
		return Promise.resolve(null);
	})
	Cart.deleteMany = jest.fn((filter)=>{
		if(filter.userId === dummyUser._id){
			return Promise.resolve(true);
		}
		return Promise.resole(null);
	})
})



describe('Cart API', ()=>{
	it('POST /api/cart/add | Add item to cart', async ()=>{
		const res = await request(app)
			.post('/api/cart/add')
			.set('Authorization', `Bearer ${token}`)
			.send({
				variant:{
					color: "Full Black",
					size: "60%"
				},
				quantity: 2,
				product: dummyProductRaw._id
			})
		
		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('item');
	}, 15000)
	
	it('GET /api/cart/ || Get all cart by user id', async ()=>{
		const res = await request(app)
			.get('/api/cart')
			.set('Authorization', `Bearer ${token}`);
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('cartItems');
	})
	
	it('DELETE /api/cart/delete/:cartItemId | Delete one cart item', async ()=>{
		const res = await request(app)
			.delete('/api/cart/delete/66294265e51dfd7c7d6a8c84')
			.set('Authorization', `Bearer ${token}`);
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
	})
	
	it('PUT /api/cart/quantity/:cartItemId | Update quantity', async ()=>{
		const res = await request(app)
			.put(`/api/cart/quantity/${dummyCartRaw._id}`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				newQuantity: 5
			});
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('cartItem');
	})
	
	it('DELETE /api/cart/delete | Delete all cart items', async ()=>{
		const res = await request(app)
			.delete('/api/cart/delete')
			.set('Authorization', `Bearer ${token}`);
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
	})
	
	it('GET /api/cart tanpa token harusnya 401', async ()=>{
		const res = await request(app).get('/api/cart');
		expect(res.status).toBe(401);
	})
})