import express from 'express';
import {
	addProduct, deleteProduct,
	getProductById,
	getProducts,
	getProductsByCategory,
	updateProduct
} from "../controllers/productController.js";
import {allowRoles, authJwt} from "../middleware/authMiddleware.js";
import checkUserExists from "../utils/checkUserExists.js";
import {productValidation} from "../validators/entityValidator.js";
import handleValidator from "../middleware/handleValidator.js";
import upload from "../middleware/uploadMiddleware.js";
const router = express.Router();

router.post('/add', authJwt, checkUserExists, allowRoles(['admin']), upload.single('images'), ...productValidation(), handleValidator, addProduct);
router.put('/update/:productId', authJwt, checkUserExists, allowRoles(['admin']), upload.none(), ...productValidation(true), handleValidator, updateProduct);
router.get('/', getProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.delete('/delete/:productId', authJwt, checkUserExists, allowRoles(['admin']), deleteProduct);
router.get('/:productId', getProductById);

export default router;