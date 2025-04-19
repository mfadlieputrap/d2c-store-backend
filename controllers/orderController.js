import Product from "../models/Product.js";
import Order from "../models/Order.js";
import snap from "../utils/midtrans.js";
import { validateOrderItems } from "../utils/orderHelper.js";

export const createOrder = async (req, res) => {
	try{
		const { items, shippingAddress, paymentMethod } = req.body;
		const userId = req.user.id;
		
		const address = await Address.findById(shippingAddress);
		
		// Validasi shippingAddress
		if (!address || address.userId.toString() !== userId) {
			return res.status(403).json({ message: "Invalid or unauthorized shipping address" });
		}
		
		// Validasi paymentMethod
		const validPaymentMethods = ['bank_transfer', 'credit_card', 'e_wallet'];
		if (!validPaymentMethods.includes(paymentMethod)) {
			return res.status(400).json({ message: "Invalid payment method" });
		}
		
		const { validatedItems, totalPrice } = await validateOrderItems(items);
		
		const newOrder = await Order.create({
			userId,
			items: validatedItems,
			shippingAddress,
			paymentMethod,
			totalPrice,
			status: 'pending'
		});
		
		for (const item of validatedItems){
			const product = await Product.findById(item.productId);
			const variant = product.variants.find(v => v.color === item.variant.color);
			const size = variant.sizes.find(s => s.size === item.variant.size);
			
			size.stock -= item.quantity;
			await product.save();
		}
		
		const midtransPayload = {
			transaction_detail:{
				order_id: `${newOrder._id.toString()}-${Date.now()}`,
				gross_amount: totalPrice
			},
			customer_details:{
			
			}
		};
		
		const midtransResponse = await snap.createTransaction(midtransPayload);
		const snapToken = midtransResponse.token;
		
		return res.status(201).json({ message: "Order created", order: newOrder, snapToken})
	}catch(e){
		console.error('[CREATE ORDER ERROR]', e);
		return res.status(500).json({ error: e.message });
	}
}

export const getAllOrders = async (req, res) => {
	try{
		const orders = await Order.find().populate('userId', "username email").populate('shippingAddress').populate('items.productId', 'name slug');
		
		return res.status(200).json(orders);
	}catch(e){
		console.error('[GET ALL ORDERS ERROR]', e);
		return res.status(500).json({ error: e.message });
	}
}

export const getAllOrdersByUserId = async (req, res) => {
	try {
		const userId = req.user.id;
		
		// Ambil semua order berdasarkan userId
		const orders = await Order.find({ userId })
			.populate('userId', 'username email')
			.populate('shippingAddress')
			.populate('items.productId', 'name slug');
		
		// Jika user tidak punya order
		if (orders.length === 0) {
			return res.status(404).json({ message: 'No orders found for this user' });
		}
		
		res.status(200).json(orders);
	} catch (e) {
		console.error('[GET ALL ORDERS BY USER ID ERROR]', e);
		res.status(500).json({ message: 'Failed to fetch orders' });
	}
};

export const getOrderById = async (req, res) => {
	try {
		const orderId = req.params.id;
		const order = await Order.findById(orderId)
			.populate('userId', 'username email')
			.populate('shippingAddress')
			.populate('items.productId', 'name slug');
		
		// Pastikan user hanya bisa lihat order mereka sendiri
		if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
			return res.status(403).json({ message: 'You are not authorized to view this order' });
		}
		
		if (!order) {
			return res.status(404).json({ message: 'Order not found' });
		}
		
		res.status(200).json(order);
	} catch (e) {
		console.error('[GET ORDER BY ID ERROR]', e);
		res.status(500).json({ message: 'Failed to fetch order' });
	}
};


export const updateOrderStatus = async (req, res) => {
	try {
		const orderId = req.params.id;
		const { status } = req.body;
		
		// Validasi status order
		const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'];
		if (!validStatuses.includes(status)) {
			return res.status(400).json({ message: 'Invalid status' });
		}
		
		const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
		
		if (!order) {
			return res.status(404).json({ message: 'Order not found' });
		}
		
		res.status(200).json({ message: 'Order status updated', order });
	} catch (e) {
		console.error('[UPDATE ORDER STATUS ERROR]', e);
		res.status(500).json({ message: 'Failed to update order status' });
	}
};

export const cancelOrder = async (req, res) => {
	try {
		const orderId = req.params.id;
		const order = await Order.findById(orderId);
		
		if (!order) {
			return res.status(404).json({ message: 'Order not found' });
		}
		
		// Pastikan user hanya bisa cancel order mereka sendiri
		if (order.userId.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: 'You are not authorized to cancel this order' });
		}
		
		if (order.status === 'shipped' || order.status === 'completed') {
			return res.status(400).json({ message: 'Order cannot be cancelled, already shipped or completed' });
		}
		
		// Update status order menjadi 'cancelled'
		order.status = 'cancelled';
		order.cancelledAt = new Date();
		await order.save();
		
		res.status(200).json({ message: 'Order cancelled successfully', order });
	} catch (e) {
		console.error('[CANCEL ORDER ERROR]', e);
		res.status(500).json({ message: 'Failed to cancel order' });
	}
};
