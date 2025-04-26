import express from 'express';
import {
	addProductToWishlist,
	deleteProductFromWishlist,
	getWishlistByUserId
} from "../controllers/wishlistController.js";
const router = express.Router();

router.get('/', getWishlistByUserId);
router.post('/add', addProductToWishlist);
router.delete('/delete/:wishlistId', deleteProductFromWishlist);

export default router;