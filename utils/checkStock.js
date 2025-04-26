import Product from "../models/Product.js";

const checkStock = async (productId, variant, quantity) => {
  const product = await Product.findById(productId).lean();
	if (!product) throw new Error("Product not found");
	
	if(product.variants.length === 0){
		if(quantity > product.defaultStock) throw new Error("Not enough stock");
	}else{
		const availableVariant = product.variants.find(v=> v.color === variant.color);
		const selectedVariant = availableVariant.sizes.find(s => s.size === variant.size);
		if(!selectedVariant) throw new Error("Variant not found");
		if(quantity > selectedVariant.stock) throw new Error("Not enough stock");
	}
}

export default checkStock;