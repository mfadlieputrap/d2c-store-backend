import Product from "../models/Product.js";
import Order from "../models/Order.js";
import snap from "../utils/midtrans.js";
import { validateOrderItems } from "../utils/orderHelper.js";
import Address from "../models/Address.js";
import { responseFormat } from '../utils/responseHelper.js';  // pastikan helper ini ada

export const createOrder = async (req, res) => {
	try {
		const { items, shippingAddress, paymentMethod } = req.body;
		const userId = req.user.id;
		
		const address = await Address.findOne({ _id: shippingAddress, userId });
		
		if (!address) {
			return responseFormat(res, 404, "Address not found");
		}
		
		// Validasi paymentMethod
		const validPaymentMethods = ['bank_transfer', 'credit_card', 'e_wallet'];
		if (!validPaymentMethods.includes(paymentMethod)) {
			return responseFormat(res, 400, "Invalid payment method");
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
			transaction_detail: {
				order_id: `${newOrder._id.toString()}-${Date.now()}`,
				gross_amount: totalPrice
			},
			customer_details: {}
		};
		
		const midtransResponse = await snap.createTransaction(midtransPayload);
		const snapToken = midtransResponse.token;
		
		return responseFormat(res, 201, "Order created", { order: newOrder, snapToken });
	} catch (e) {
		console.error('[CREATE ORDER ERROR]', e.message);
		return responseFormat(res, 500, e.message);
	}
};

export const getAllOrders = async (req, res) => {
	try {
		const orders = await Order.find().populate('userId', "username email").populate('shippingAddress').populate('items.productId', 'name slug');
		return responseFormat(res, 200, "List of orders retrieved", orders);
	} catch (e) {
		console.error('[GET ORDERS ERROR] ', e.message);
		return responseFormat(res, 500, e.message);
	}
};

export const getAllOrdersByUserId = async (req, res) => {
	try {
		const userId = req.user.id;
		const orders = await Order.find({ userId })
			.populate('userId', 'username email')
			.populate('shippingAddress')
			.populate('items.productId', 'name slug');
		
		return responseFormat(res, 200, "List of orders by user id retrieved", orders);
	} catch (e) {
		console.error('[GET ALL ORDERS BY USER ID ERROR] ', e,message);
		return responseFormat(res, 500, "Failed to fetch orders");
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
		if (order.userId._id !== req.user.id) {
			return responseFormat(res, 403, "You are not authorized to view this order");
		}
		
		if (!order) {
			return responseFormat(res, 404, "Order not found");
		}
		
		return responseFormat(res, 200, "Order detail retrieved", order);
	} catch (e) {
		console.error('[GET ORDER BY ID ERROR]', e,message);
		return responseFormat(res, 500, "Failed to fetch order");
	}
};

export const updateOrderStatus = async (req, res) => {
	try {
		const orderId = req.params.orderId;
		const { status } = req.body;
		
		// Validasi status order
		const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'];
		if (!validStatuses.includes(status)) {
			return responseFormat(res, 400, "Invalid status");
		}
		
		const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true, runValidators: true });
		
		if (!order) {
			return responseFormat(res, 404, "Order not found");
		}
		
		return responseFormat(res, 200, "Order status updated", order);
	} catch (e) {
		console.error('[UPDATE ORDER STATUS ERROR]', e,message);
		return responseFormat(res, 500, "Failed to update order status");
	}
};

export const cancelOrder = async (req, res) => {
	try {
		const orderId = req.params.orderId;
		const order = await Order.findOne({ _id: orderId, userId: req.user.id });
		
		if (!order) {
			return responseFormat(res, 404, "Order not found");
		}
		
		// Pastikan user hanya bisa cancel order mereka sendiri
		if (order.userId !== req.user.id) {
			return responseFormat(res, 403, "You are not authorized to cancel this order");
		}
		
		if (order.status === 'shipped' || order.status === 'completed') {
			return responseFormat(res, 400, "Order cannot be cancelled, already shipped or completed");
		}
		
		// Update status order menjadi 'cancelled'
		order.status = 'cancelled';
		order.cancelledAt = new Date();
		await order.save();
		
		return responseFormat(res, 200, "Order cancelled successfully", order);
	} catch (e) {
		console.error('[CANCEL ORDER ERROR] ', e.message);
		return responseFormat(res, 500, "Failed to cancel order");
	}
};
