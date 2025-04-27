import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import { responseFormat } from '../utils/responseHelper.js';

export const createPayment = async (req, res) => {
	try{
		const { orderId, paymentType, transactionStatus, transactionId, paymentResult, paidAt} = req.body;
		const status = transactionStatus?.toLowerCase();
		const order = await Order.findById(orderId);
		console.log(order);
		if(!order){
			return responseFormat(res, 404, "Order not found");
		}
		
		const existingPayment = await Payment.findOne({ order: orderId });
		if(existingPayment){
			return responseFormat(res, 409, "Payment already exists for this order");
		}
		
		const payment = await Payment.create({
			order: orderId,
			paymentType,
			transactionStatus,
			transactionId,
			paymentResult,
			paidAt: status === 'settlement' ? (paidAt || new Date()) : null
		})
		console.log(payment);
		if(transactionStatus === 'settlement'){
			await Order.findByIdAndUpdate(orderId, {
				status: 'paid',
				paymentStatus: 'settlement'
			});
		}
		
		return responseFormat(res, 201, "Payment recorded", payment);
	}catch(e){
		console.error('[CREATE PAYMENT ERROR] ', e.message);
		return responseFormat(res, 500, e.message);
	}
}

export const getPaymentByOrderId = async (req, res) => {
	try{
		const {orderId} = req.params;
		const payment = await Payment.findOne({ order: orderId });
		if(!payment){
			return responseFormat(res, 404, "Payment not found");
		}
		
		return responseFormat(res, 200, "Payment detail retrieved", payment);
	}catch(e){
		console.error("[GET PAYMENT DETAILS ERROR] ", e.message);
		return responseFormat(res, 500, e.message);
	}
}

export const getAllPayments = async (req, res) => {
	try{
		const payments = await Payment.find().populate('order');
		return responseFormat(res, 200, "List of payments retrieved", payments);
	}catch(e){
		console.error('[GET ALL PAYMENTS ERROR] ', e.message);
		return responseFormat(res, 500, e.message);
	}
}

export const updatePaymentStatus = async (req, res) => {
	try {
		const { orderId } = req.params;
		const { transactionStatus } = req.body;
		
		const updatedPayment = await Payment.findOneAndUpdate(
			{ order: orderId },
			{ transactionStatus },
			{ new: true }
		);
		
		if (!updatedPayment) {
			return responseFormat(res, 404, "Payment not found");
		}
		
		return responseFormat(res, 200, "Payment updated", updatedPayment);
	} catch (e) {
		console.error('[UPDATE PAYMENT ERROR] ', e.message);
		return responseFormat(res, 500, e.message);
	}
};

export const handleMidtransCallback = async (req, res) => {
	try {
		const { order_id, transaction_status, transaction_id } = req.body;
		
		const orderId = order_id.split('-')[0]; // misal "6533bc-...-timestamp"
		
		const payment = await Payment.findOneAndUpdate(
			{ order: orderId },
			{
				transactionStatus: transaction_status,
				transactionId: transaction_id,
				paidAt: transaction_status === 'settlement' ? new Date() : null,
			},
			{ new: true }
		);
		
		if (transaction_status === 'settlement') {
			await Order.findByIdAndUpdate(orderId, {
				status: 'paid',
				paymentStatus: 'settlement'
			});
		}
		
		return responseFormat(res, 200, "Callback received", payment);
	} catch (e) {
		console.error('[MIDTRANS CALLBACK ERROR] ', e.message);
		return responseFormat(res, 500, e.message);
	}
};

export const deletePayment = async (req, res) => {
	try {
		const { orderId } = req.params;
		const deletedPayment = await Payment.findOneAndDelete({ order: orderId });
		console.log(deletedPayment);
		if (!deletedPayment) {
			return responseFormat(res, 404, "Payment not found");
		}
		
		return responseFormat(res, 200, "Payment deleted successfully");
	} catch (e) {
		console.error('[DELETE PAYMENT ERROR] ', e.message);
		return responseFormat(res, 500, e.message);
	}
};
