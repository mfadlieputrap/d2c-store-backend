import Category from "../models/Category.js";
import {responseFormat} from "../utils/responseHelper.js";

export const addCategory = async (req, res) => {
	try {
		const { name, parent } = req.body;
		
		const existing = await Category.findOne({name});
		if(existing){
			return responseFormat(res, 409, "Category already exists");
		}
		
		if(parent){
			const parentCategory = await Category.findById(parent);
			if(!parentCategory){
				return responseFormat(res, 400, "Parent category not found");
			}
		}
		
		const newCategory = await Category.create({
			name,
			parent
		})
		
		return responseFormat(res, 201, "Category added successfully", newCategory);
	} catch (e) {
		console.error('[ADD CATEGORY ERROR] ', e.message);
		return responseFormat(res, 500, error.message);
	}
}

export const getCategories = async (req, res) => {
	try {
		const categories = await Category.find();
		
		return responseFormat(res, 200, "List of categories retrieved", categories);
	} catch (e) {
		console.error('[GET CATEGORIES ERROR] ', e.message);
		return responseFormat(res, 500, error.message);
	}
}

export const updateCategory = async (req, res) => {
	try{
		const {categoryId} = req.params;
		const {name} = req.body;
		
		const category = await Category.findByIdAndUpdate(categoryId, {
			name
		}, { new: true, runValidators: true});
		if(!category){
			return responseFormat(res, 400, "Category not found");
		}
		
		return responseFormat(res, 200, "Category updated successfully", category);
	}catch(e){
		console.error('[UPDATE CATEGORY] ', e.message);
		return responseFormat(res, 500, error.message);
	}
}

export const deleteCategory = async (req, res) => {
	try{
		const categoryId = req.params.id;
		const result = await Category.findByIdAndDelete(categoryId);
		if(!result){
			return responseFormat(res, 404, "Category not found or already deleted");
		}
		return responseFormat(res, 404, "Category deleted successfully", result);
	}catch(e){
		console.error('[DELETE CATEGORY] ', e.message);
		return responseFormat(res, 500, error.message);
	}
}