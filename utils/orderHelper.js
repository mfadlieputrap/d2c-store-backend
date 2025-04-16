import Product from "../models/Product.js";



export const validateOrderItems = async (items)=>{
	const validatedItems = [];
	let totalPrice = 0;
	
	for (const item of items) {
		const product = await Product.findById(item.productId);
		if(!product) throw new Error("Product not found");
		const variant = product.variants.find(v => v.color === item.variant?.color);
		if(!variant) throw new Error("Variant color not found");
		const sizeObj = variant.sizes.find(s => s.size === item.variant?.size);
		if(!sizeObj) throw new Error("Variant size not found");
		if(sizeObj.stock < item.quantity) throw new Error("Not enough stock");
		
		const price = sizeObj.price;
		const subtotal = price * item.quantity;
		totalPrice += subtotal;
		
		validatedItems.push({
			productId: item.productId,
			variant: item.variant,
			quantity: item.quantity,
			price: price
		});
	}
	
	return { validatedItems, totalPrice };
}