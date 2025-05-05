import request from 'supertest';
import app from '../app.js';
import path from 'path';
import {beforeAll, jest} from '@jest/globals';
import Product from '../models/Product.js';
import {genToken, dummyProductRaw, dummyProductPopulated, dummyUser} from "../utils/dummyHelper.js";
import User from "../models/User.js";

let adminToken;

beforeAll(async()=>{
	adminToken = await genToken(true);
	User.findById = jest.fn().mockResolvedValue(dummyUser);
	Product.create = jest.fn().mockResolvedValue(dummyProductRaw);
	Product.find = jest.fn((query) => {
		if (query && query.category === dummyProductRaw.category) {
			return {
				sort: jest.fn().mockReturnValue({
					skip: jest.fn().mockReturnValue({
						limit: jest.fn().mockResolvedValue([dummyProductRaw])
					})
				})
			};
		}
		// Default return if category doesn't match
		return {
			sort: jest.fn().mockReturnValue({
				skip: jest.fn().mockReturnValue({
					limit: jest.fn().mockResolvedValue([dummyProductRaw])
				})
			})
		};
	});
	Product.countDocuments = jest.fn((query) => {
		if (query && query.category === dummyProductRaw.category) {
			return Promise.resolve(1);
		}
		return Promise.resolve(1);
	});
	Product.findById = jest.fn().mockReturnValue({
		populate: jest.fn().mockResolvedValue(dummyProductPopulated)
	});
	Product.findByIdAndUpdate = jest.fn().mockResolvedValue({
		...dummyProductRaw,
		description: 'Update product'
	});
	Product.findByIdAndDelete = jest.fn().mockResolvedValue(dummyProductRaw);
})

describe('Product API', ()=>{
	it('Create Product', async()=>{
		const res = await request(app)
			.post('/api/products/add')
			.set('Authorization', `Bearer ${adminToken}`)
			.field('name', "Keyboard Gaming")
			.field('description', "Keyboard gaming with RGB backlight and red Switch")
			.field('detail', "Keyboard gaming compact 60% with backlight RGB and red switch hotswap")
			.field('category', "66294265e51dfd7c7d6a8c45")
			.field('variants[0].color', 'Full Black')
			.field('variants[0].sizes[0].size', '60%')
			.field('variants[0].sizes[0].stock', 300)
			.field('variants[0].sizes[0].price', 178000)
			// .field('variants', JSON.stringify([
			// 	{
			// 		color: "Full Black",
			// 		sizes: [{
			// 			size: "60%",
			// 			stock: 300,
			// 			price: 178000
			// 		}]
			// 	}
			// ]))
			.attach('images', path.resolve('uploads/1745659741342-493734522-3024559-cover.jpg'));
		
		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('status');
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('data');
	})
	
	it('Get all products', async()=>{
		const res = await request(app)
			.get('/api/products/');
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message', 'All products retrieved');
		expect(res.body).toHaveProperty('data');
		expect(Array.isArray(res.body.data.products)).toBe(true);
		expect(res.body.data.products[0]).toHaveProperty('name');
		expect(res.body.data).toHaveProperty('pagination');
		expect(res.body.data.pagination).toEqual({
			total: 1,
			page: 1,
			limit: 25,
			totalPages: 1,
		});
	})
	
	it('Get products by categories', async()=>{
		const res = await request(app)
			.get('/api/products/category/66294265e51dfd7c7d6a8c96');
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message', 'Products by category retrieved');
		expect(res.body).toHaveProperty('data');
		expect(Array.isArray(res.body.data.products)).toBe(true);
		expect(res.body.data.products[0]).toHaveProperty('name');
		expect(res.body.data).toHaveProperty('pagination');
		expect(res.body.data.pagination).toEqual({
			total: 1,
			page: 1,
			limit: 25,
			totalPages: 1,
		});
	})
	
	it('Get Product By Id', async()=>{
		const res = await request(app)
			.get('/api/products/66294265e51dfd7c7d6a8c45')
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('data');
	})
	
	it('Update Product', async() =>{
		const res = await request(app)
			.put('/api/products/update/66294265e51dfd7c7d6a8c45')
			.set('Authorization',`Bearer ${adminToken}`)
			.send({
				description: 'Update Product',
			})
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('data');
	})
	
	it('Delete product', async ()=>{
		const res = await request(app)
			.delete('/api/products/delete/66294265e51dfd7c7d6a8c45')
			.set('Authorization', `Bearer ${adminToken}`);
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
	})
})
