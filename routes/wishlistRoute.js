import express from 'express';
import {
	addProductToWishlist,
	deleteProductFromWishlist,
	getWishlistByUserId
} from "../controllers/wishlistController.js";
import {allowRoles, authJwt} from "../middleware/authMiddleware.js";
import checkUserExists from "../utils/checkUserExists.js";
const router = express.Router();

router.get('/', authJwt, checkUserExists, allowRoles('customer'), getWishlistByUserId);
router.post('/add', authJwt, checkUserExists, allowRoles('customer'), addProductToWishlist);
router.delete('/delete/:wishlistId', authJwt, checkUserExists, allowRoles('customer'), deleteProductFromWishlist);

export default router;