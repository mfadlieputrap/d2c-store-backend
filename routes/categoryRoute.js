import express from 'express';
import {categoryValidation} from "../validators/entityValidator.js";
import handleValidator from "../middleware/handleValidator.js";
import {addCategory, deleteCategory, getCategories, updateCategory} from "../controllers/categoryController.js";
const router = express.Router();


router.post('/add', ...categoryValidation(), handleValidator, addCategory);
router.put('/update/:categoryId', ...categoryValidation(true), handleValidator, updateCategory);
router.get('/', getCategories);
router.delete('/delete/:categoryId', deleteCategory);

export default router;