import checkUserExists from "../utils/checkUserExists.js";
import Wishlist from "../models/Wishlist.js";

export const getWishlistByUserId = async (req, res) => {
	try {
		await checkUserExists(req.user.id);
		const wishlists = await Wishlist.find({userId: req.user.id}).populate("productId", "name defaultPrice");
		
		return res.status(200).json({ message: "Wishlist user retrieved", wishlists});
	} catch (e) {
		return res.status(500).json({error: e.message});
	}
}
export const addProductToWishlist = async (req, res) => {
	try {
		await checkUserExists(req.user.id);
		const {productId} = req.params;
		
		const existing = await Wishlist.findOne({userId: req.user.id, productId});
		if(existing){
			return res.status(409).json({ message: "Product already in wishlist"});
		}
		
		const wishlist = await Wishlist.create({
			userId: req.user.id,
			productId
		})
		
		return res.status(201).json({ message: "Product added to wishlist successfully", wishlist});
	} catch (e) {
		return res.status(500).json({error: e.message});
	}
}
export const deleteProductFromWishlist = async (req, res) => {
	try {
		await checkUserExists(req.user.id);
		const {wishlistId} = req.params;
		const result = await Wishlist.findByIdAndDelete(wishlistId);
		if(!result){
			return res.status(404).json({ message: "Product not found in wishlist or already deleted"});
		}
		
		return res.status(200).json({ message: "Delete product from wishlist successfully" });
	} catch (e) {
		return res.status(500).json({error: e.message});
	}
}