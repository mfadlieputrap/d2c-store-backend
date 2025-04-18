import express from 'express';
import checkUserExists from "../utils/checkUserExists.js";
import {
	addProduct, deleteProduct,
	getProductById,
	getProducts,
	getProductsByCategory,
	updateProduct
} from "../controllers/productController.js";
import {allowRoles, authJwt} from "../middleware/authMiddleware.js";
const router = express.Router();

router.post('/add', authJwt, allowRoles('admin'), addProduct);
router.put('/update/:productId', updateProduct);
router.get('/', getProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.delete('/delete/:productId', deleteProduct);
router.get('/:productId', getProductById);

export default router;