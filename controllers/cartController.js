import Cart from "../models/Cart.js";
import checkStock from "../utils/checkStock.js";

export const getCartByUserId = async (req, res) => {
	try {
		const userId = req.user.id;
		const cartItems = await Cart.find({userId}).sort({ createdAt: -1 }).populate('productId', 'name defaultPrice variants').lean();
		
		const updatedCartItems = cartItems.map(item => {
			const product = item.productId;
			const variant = product.variants.find(v => v.color === item.variant.color && v.size === item.variant.size);
			item.price = variant ? variant.price : product.defaultPrice;
			return item;
		})
		
		return res.status(200).json({ message: "Cart items retrieved", cartItems: updatedCartItems });
	} catch (e) {
		return res.status(500).json({error: e.message});
	}
}
export const addProductToCart = async (req, res) => {
	try {
		const { productId, variant, quantity } = req.body;
		if(quantity <=0){
			return res.status(400).json({ message: "Quantity must be greater than 0" });
		}
		await checkStock(productId, variant, quantity);
		
		const existing = await Cart.findOne({userId: req.user.id, productId, "variant.color": variant.color, "variant.size": variant.size});
		if(existing){
			existing.quantity += quantity;
			await existing.save();
			return res.status(200).json({ message: "Cart item updated successfully", item: existing});
		}
		
		const newItem = await Cart.create({
			userId: req.user.id,
			productId,
			variant,
			quantity
		})
		return res.status(201).json({ message: "Add items to cart successfully", item: newItem});
	} catch (e) {
		return res.status(500).json({error: e.message});
	}
}

export const deleteProductFromCart = async (req, res) => {
	try {
		const {cartItemId} = req.params;
		
		const result = await Cart.findOneAndDelete({_id: cartItemId, userId: req.user.id});
		if(!result){
			return res.status(404).json({ message: "Cart item not found or already deleted"});
		}
		return res.status(200).json({ message: "Cart item deleted successfully"});
	} catch (e) {
		return res.status(500).json({error: e.message});
	}
}

export const updateQuantity = async (req, res) => {
	try{
	const {cartItemId} = req.params;
	const { newQuantity } = req.body;
	
	const cartItem = await Cart.findById(cartItemId);
	if(!cartItem){
		return res.status(404).json({ message: "Cart item not found" });
	}
	if(cartItem.userId.toString() !== req.user.id){
		return res.status(403).json({ message: "You do not have permission to update cart item" });
	}
	if(newQuantity <=0){
		return res.status(400).json({ message: "Quantity must be greater than 0" });
	}
	cartItem.quantity = newQuantity;
	await cartItem.save();
	
	return res.status(200).json({ message: "Change quantity successfully", cartItem});
	}catch(e){
		return res.status(500).json({ error: e.message });
	}
}

export const deleteAllCartItem = async (req, res) => {
	try{
		const result = await Cart.deleteMany({userId: req.user.id});
		if(result.deletedCount === 0){
			return res.status(404).json({ message: "Cart item not found or already exists" });
		}
		return res.status(200).json({ message: `${result.deletedCount} Item(s) in cart deleted successfully` });
	}catch(e){
		return res.status(500).json({ error: e.message });
	}
}