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

router.post('/add',...cartValidation, handleValidator, addProductToCart);
router.get('/', getCartByUserId);
router.put('/update-quantity', ...updateQuantityValidation, handleValidator, updateQuantity);
router.delete('/delete', deleteAllCartItem);
router.delete('/delete/:id', deleteProductFromCart);

export default router;