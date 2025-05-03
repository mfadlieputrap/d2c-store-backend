import checkUserExists from "../utils/checkUserExists.js";
import Wishlist from "../models/Wishlist.js";
import {responseFormat} from "../utils/responseHelper.js";

export const getWishlistByUserId = async (req, res) => {
	try {
		const wishlists = await Wishlist.find({userId: req.user.id}).populate("product", "name variants.price");
		
		return responseFormat(res, 200, 'Wishlist user retrieved', wishlists);
	} catch (e) {
		console.error('[GET WISHLIST BY USER ID ERROR] ', e.message);
		return responseFormat(res, 500, e.message);
	}
}
export const addProductToWishlist = async (req, res) => {
	try {
		const {product} = req.body;
		
		const existing = await Wishlist.findOne({userId: req.user.id, product});
		if(existing){
			return responseFormat(res, 409, 'Product already in wishlist');
		}
		
		const wishlist = await Wishlist.create({
			userId: req.user.id,
			product
		})
		
		return responseFormat(res, 201, 'Product added to wishlhist successfully', wishlist);
	} catch (e) {
		console.error('[ADD PRODUCT TO WISHLIST ERROR] ', e.message);
		return responseFormat(res, 500, e.message);
	}
}

export const deleteProductFromWishlist = async (req, res) => {
	try {
		const {wishlistId} = req.params;
		const result = await Wishlist.findByIdAndDelete(wishlistId);
		if(!result){
			return responseFormat(res, 404, 'Product not found in wishlist or already deleted');
		}
		
		return responseFormat(res, 200, 'Delete product from wishlist successfully', result );
	} catch (e) {
		console.error('[DELETE PRODUCT FROM WISHLIST ERROR] ', e.message);
		return responseFormat(res, 500, e.message);
	}
}