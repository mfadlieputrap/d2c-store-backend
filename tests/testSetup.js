// import request from 'supertest';
// import app from '../app.js';
//
// let token;
// let dummyUser;
//
// beforeAll(async ()=>{
// 	// Register dummy user
// 	const res = await request(app).post('/api/auth/register').send({
// 		username: 'mockuser',
// 		email: 'mock@example.com',
// 		password: 'Password123!',
// 	})
//
// 	// Login dan ambil token
// 	await request(app).post('/api/auth/login').send({
// 		email: 'mock@example.com',
// 		password: 'Password123!',
// 	})
// 	console.log('[TEST] Register response:', res.status);
// 	token = res.token;
// 	dummyUser = res.body.user || { email: 'mock@example.com' };
// }, 15000);
//
// export {token, dummyUser};