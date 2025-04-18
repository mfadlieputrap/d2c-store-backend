import request from 'supertest';
import app from '../app.js';
import jwt from 'jsonwebtoken';
import {beforeAll, jest} from '@jest/globals';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
dotenv.config();

let dummyProductRaw;
let dummyProductPopulated;
let token;

beforeAll(async()=>{
	token = await jwt.sign({ id: "66294265e51dfd7c7d6a8d94", role: "admin"}, process.env.JWT_SECRET, { expiresIn: '2h'});
	
	dummyProductRaw = {
		_id: "66294265e51dfd7c7d6a8c45",
		name: "Keyboard Gaming",
		description: "Keyboard gaming with RGB backlight and red Switch",
		detail: "Keyboard gaming compact 60% with backlight RGB and red switch hotswap",
		variants:[{
			color: "Full Black",
			size: "60%",
			stock: 300,
			price: 178000
		}],
		images: "keyboard-gaming.jpg",
		category: "66294265e51dfd7c7d6a8c96"
	}
	
	dummyProductPopulated = {
		...dummyProductRaw,
		category: {
			_id: "66294265e51dfd7c7d6a8c96",
			name: "Keyboard"
		}
	}
	
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
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: "Keyboard Gaming",
				description: "Keyboard gaming with RGB backlight and red Switch",
				detail: "Keyboard gaming compact 60% with backlight RGB and red switch hotswap",
				category: "66294265e51dfd7c7d6a8c45",
				variants:[{
					color: "Full Black",
					size: "60%",
					stock: 300,
					price: 178000
				}],
				images: "keyboard-gaming.jpg"
			})
		
		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('product');
	})
	
	it('Get all products', async()=>{
		const res = await request(app)
			.get('/api/products/');
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message', 'All products retrieved');
		expect(res.body).toHaveProperty('products');
		expect(Array.isArray(res.body.products)).toBe(true);
		expect(res.body.products[0]).toHaveProperty('name');
		expect(res.body).toHaveProperty('pagination');
		expect(res.body.pagination).toEqual({
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
		expect(res.body).toHaveProperty('products');
		expect(Array.isArray(res.body.products)).toBe(true);
		expect(res.body.products[0]).toHaveProperty('name', 'Keyboard Gaming');
		expect(res.body).toHaveProperty('pagination');
		expect(res.body.pagination).toEqual({
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
		expect(res.body).toHaveProperty('product');
	})
	
	it('Update Product', async() =>{
		const res = await request(app)
			.put('/api/products/update/66294265e51dfd7c7d6a8c45')
			.send({
				description: 'Update Product',
			})
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
		expect(res.body).toHaveProperty('product');
	})
	
	it('Delete product', async ()=>{
		const res = await request(app)
			.delete('/api/products/delete/66294265e51dfd7c7d6a8c45')
		
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('message');
	})
})
