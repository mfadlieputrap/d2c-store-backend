import Product from "../models/Product.js";
import {responseFormat} from "../utils/responseHelper.js";

export const addProduct = async (req, res) => {
	try {
		const productData = req.body
		const product = await Product.create({
			...productData,
			images: req.file.filename
		});
		return responseFormat(res, 201, "Product added successfully", product);
	} catch (e) {
		return responseFormat(res, 500, e.message);
	}
}

export const getProducts = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 25;
		const skip = (page - 1)*limit;
		
		const products = await Product.find()
			.sort({ createdAt: 1})
			.skip(skip)
			.limit(limit);
		const total = await Product.countDocuments();
		return responseFormat(res, 200, "All products retrieved", {
			products,
			pagination:{
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit)
			}
		});
	} catch (e) {
		console.error("[GET PRODUCTS ERROR] ", e.message)
		return responseFormat(res, 500, e.message);
	}
}

export const getProductsByCategory = async (req, res) => {
	try{
		const { categoryId } = req.params;
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 25;
		const skip = (page - 1)*limit;
		
		const total = await Product.countDocuments({ category: categoryId});
		
		const productsByCategory =  await Product.find({category: categoryId})
			.sort({ createdAt: 1})
			.skip(skip)
			.limit(limit);
		
		return responseFormat(res, 200, "Products by category retrieved", {
			products: productsByCategory,
			pagination:{
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit)
			}
		})
	}catch(e){
		console.log('[GET PRODUCTS BY CATEGORY ERROR] ', e.message);
		return responseFormat(res, 500, e.message);
	}
}

export const getProductById = async (req, res) => {
	try {
		const {productId} = req.params;
		const product = await Product.findById(productId).populate('category', 'name');
		if(!product) {
			return responseFormat(res, 404, 'Product not found');
		}
		return responseFormat(res, 200, 'Product detail retrieved', product);
	} catch (e) {
		return responseFormat(res, 500, e.message);
	}
}
export const updateProduct = async (req, res) => {
	try {
		const {productId} = req.params;
		const updateData = req.body;
		const updatedProduct = await Product.findByIdAndUpdate(
			productId,
			{...updateData},
			{new: true, runValidators: true});
		
		return responseFormat(res, 200, 'Product updated successfully', { product: updatedProduct });
	} catch (e) {
		console.error("[UPDATE PRODUCT ERROR] ", e.message);
		return responseFormat(res, 500, e.message);
	}
}

export const deleteProduct = async (req, res) => {
	try {
		const {productId} = req.params;
		const result = await Product.findByIdAndDelete(productId);
		if(!result) {
			return responseFormat(res, 404, 'Product not found or already deleted');
		}
		return responseFormat(res, 200, 'Product deleted successfully', result);
	} catch (e) {
		return responseFormat(res, 500, e.message);
	}
}