import Cart from "../models/Cart.js";
import checkStock from "../utils/checkStock.js";
import {responseFormat} from "../utils/responseHelper.js";

export const getCartByUserId = async (req, res) => {
	try {
		const userId = req.user.id;
		const cartItems = await Cart.find({userId}).sort({ createdAt: -1 }).populate('product', 'name  variants').lean();
		
		const updatedCartItems = cartItems.map(item => {
			const product = item.product;
			const variant = product.variants.find(v => v.color === item.variant.color && v.size === item.variant.size);
			item.price = variant.price;
			return item;
		})
		
		return responseFormat(res, 200, "Cart items retrieved", updatedCartItems);
	} catch (e) {
		console.error('[GET CART BY USER ID ERROR] ', e.message);
		return responseFormat(res, 500, error.message);
	}
}
export const addProductToCart = async (req, res) => {
	try {
		const { product, variant, quantity } = req.body;
		if(quantity <=0){
			return responseFormat(res, 400, "Quantity must be greater than 0");
		}
		await checkStock(product, variant, quantity);
		
		const existing = await Cart.findOne({userId: req.user.id, product, "variant.color": variant.color, "variant.size": variant.size});
		if(existing){
			existing.quantity += quantity;
			await existing.save();
			return responseFormat(res, 200, "Cart item updated succesfully", existing);
		}
		
		const newItem = await Cart.create({
			userId: req.user.id,
			product,
			variant,
			quantity
		})
		return responseFormat(res, 201, "Add items to cart successfully", newItem);
	} catch (e) {
		console.error('[ADD PRODUCT TO CART ERROR] ', e.message);
		return responseFormat(res, 500, error.message);
	}
}

export const deleteProductFromCart = async (req, res) => {
	try {
		const {cartItemId} = req.params;
		
		const result = await Cart.findOneAndDelete({_id: cartItemId, userId: req.user.id});
		if(!result){
			return responseFormat(res, 404, "Cart item not found or already deleted");
		}
		return responseFormat(res, 200, "Cart item deleted successfully", result);
	} catch (e) {
		console.error('[DELETE PRODUCT FROM CART ERROR] ', e.message);
		return responseFormat(res, 500, error.message);
	}
}

export const updateQuantity = async (req, res) => {
	try{
	const {cartItemId} = req.params;
	const { newQuantity } = req.body;
	
	const cartItem = await Cart.findById(cartItemId);
	if(!cartItem){
		return responseFormat(res, 404, "Cart item not found");
	}
	if(cartItem.userId.toString() !== req.user.id){
		return responseFormat(res, 403, "You do not have permission to update cart item");
	}
	if(newQuantity <=0){
		return responseFormat(res, 400, "Quantity must be greater than 0");
	}
	cartItem.quantity = newQuantity;
	await cartItem.save();
	
	return responseFormat(res, 200, "Change quantity successfully");
	
	}catch(e){
		console.error('[UPDATE QUANTITY ERROR] ', e.message);
		return responseFormat(res, 500, error.message);
	}
}

export const deleteAllCartItem = async (req, res) => {
	try{
		const result = await Cart.deleteMany({userId: req.user.id});
		if(result.deletedCount === 0){
			return responseFormat(res, 404, "Cart item not found or already deleted");
		}
		return responseFormat(res, 200, `${result.deletedCount} Item(s) in cart deleted successfully`);
	}catch(e){
		console.error('[DELETE ALL CART ITEM ERROR] ', e.message);
		return responseFormat(res, 500, error.message);
	}
}