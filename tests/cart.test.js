import request from 'supertest';
import app from '../app.js';




describe('Cart API', ()=>{
	it('GET /api/cart tanpa token harusnya 401', async ()=>{
		const res = await request(app).get('/api/cart');
		expect(res.status).toBe(401);
	})
})