import express from 'express';
import {allowRoles, authJwt} from "../middleware/authMiddleware.js";
import handleValidator from "../middleware/handleValidator.js";
import {
	addProductToCart, deleteAllCartItem,
	deleteProductFromCart,
	getCartByUserId,
	updateQuantity
} from "../controllers/cartController.js";
import {cartValidation, updateQuantityValidation} from "../validators/entityValidator.js";
const router = express.Router();

router.post('/add', authJwt, allowRoles('customer'), ...cartValidation, handleValidator, addProductToCart);
router.get('/', authJwt, allowRoles('customer'), getCartByUserId);
router.put('/update-quantity', authJwt, allowRoles('customer'), ...updateQuantityValidation, handleValidator, updateQuantity);
router.delete('/delete', authJwt, allowRoles('customer'), deleteAllCartItem);
router.delete('/delete/:id', authJwt, allowRoles('customer'), deleteProductFromCart);

export default router;