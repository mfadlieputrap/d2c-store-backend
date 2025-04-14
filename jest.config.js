export default {
	testEnvironment: 'node',
	transform: {}, // biarkan kosong kalau gak pakai Babel
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1', // agar import path bisa tanpa .js
	},
};
