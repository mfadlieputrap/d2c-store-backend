import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
	try {
		const product = await Product.create(req.body);
		return res.status(201).json({ message: "Product added successfully", product });
	} catch (e) {
		return res.status(500).json({error: e.message});
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
		return res.status(200).json({
			message: "All products retrieved",
			products,
			pagination:{
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit)
			}
		});
	} catch (e) {
		return res.status(500).json({error: e.message});
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
		
		return res.status(200).json({
			message: "Products by category retrieved",
			products: productsByCategory,
			pagination:{
				page,
				limit,
				skip,
				totalPages: Math.ceil(total / limit)
			}
		});
	}catch(e){
		return res.status(500).json({ error: e.message });
	}
}

export const getProductById = async (req, res) => {
	try {
		const {productId} = req.params;
		const product = await Product.findById(productId).populate('category', 'name');
		if(!product) {
			return res.status(404).json({ message: "Product not found" });
		}
		return res.status(200).json({ message: "Product detail retrieved",product });
	} catch (e) {
		return res.status(500).json({error: e.message});
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
		
		return res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
	} catch (e) {
		return res.status(500).json({error: e.message});
	}
}

export const deleteProduct = async (req, res) => {
	try {
		const {productId} = req.params;
		const result = await Product.findByIdAndDelete(productId);
		if(!result) {
			return res.status(404).json({ message: "Product not found or already not found" });
		}
		return res.status(200).json({ message: "Product deleted successfully" });
	} catch (e) {
		return res.status(500).json({error: e.message});
	}
}