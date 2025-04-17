import Category from "../models/Category.js";

export const addCategory = async (req, res) => {
	try {
		const { name, parent } = req.body;
		
		const existing = await Category.findOne({name});
		if(existing){
			return res.status(409).json({ message: 'Category already exists' });
		}
		
		if(parent){
			const parentCategory = await Category.findById(parent);
			if(!parentCategory){
				return res.status(400).json({ error: "Parent category not found" });
			}
		}
		
		const newCategory = await Category.create({
			name,
			parent
		})
		
		return res.status(201).json({ category: newCategory });
	} catch (e) {
		return res.status(500).json({error: e.message});
	}
}

export const getCategories = async (req, res) => {
	try {
		const categories = await Category.find();
		
		return res.status(200).json({ message: "List of all category retrieved", categories: categories });
	} catch (e) {
		return res.status(500).json({error: e.message});
	}
}

export const deleteCategory = async (req, res) => {
	try{
		const {categoryId} = req.params;
		const category = await Category.findByIdAndDelete(categoryId);
		if(!category){
			return res.status(404).json({ message: "Category not found or already deleted" });
		}
		return res.status(200).json({ message: "Category deleted successfully" });
	}catch(e){
		return res.status(500).json({ error: e.message });
	}
}