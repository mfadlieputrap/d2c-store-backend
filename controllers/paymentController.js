import Order from "../models/Order.js";
import Payment from "../models/Payment.js";

export const createPayment = async (req, res) => {
	try{
		const { orderId, paymentType, transactionStatus, transactionId, paymentResult, paidAt} = req.body;
		const status = transactionStatus?.toLowerCase();
		const order = await Order.findById(orderId);
		if(!order){
			return res.status(404).json({ message: "Order not found"});
		}
		
		const existingPayment = await Payment.findOne({ orderId });
		if(existingPayment){
			return res.status(409).json({ message: "Payment already exists for this order" });
		}
		
		const payment = await Payment.create({
			orderId,
			paymentType,
			transactionStatus,
			transactionId,
			paymentResult,
			paidAt: status === 'settlement' ? (paidAt || new Date()) : null
		})
		
		if(transactionStatus === 'settlement'){
			await Order.findByIdAndUpdate(orderId, {
				status: 'paid',
				paymentStatus: 'settlement'
			});
		}
		
		return res.status(201).json({ message: "Payment recorded", payment});
	}catch(e){
		console.error('[CREATE PAYMENT ERROR]', e);
		return res.status(500).json({ error: e.message });
	}
}

export const getPaymentByOrderId = async (req, res) => {
	try{
		const {orderId} = req.params;
		const payment = await Payment.findOne({ orderId });
		if(!payment){
			return res.status(404).json({ message: "Payment not found"});
		}
		
		return res.status(200).json({ message: "Payment detail retrieved", payment})
	}catch(e){
		console.error("Get payment details error: ", e.message);
		return res.status(500).json({ error: e.message });
	}
}

export const getAllPayments = async (req, res) => {
	try{
		const payments = await Payment.find().populate('orderId');
		return res.status(200).json({ message: "List of payments retrieved", payments});
	}catch(e){
		return res.status(500).json({ error: e.message });
	}
}

export const updatePaymentStatus = async (req, res) => {
	try {
		const { orderId } = req.params;
		const { transactionStatus } = req.body;
		
		const updatedPayment = await Payment.findOneAndUpdate(
			{ orderId },
			{ transactionStatus },
			{ new: true }
		);
		
		if (!updatedPayment) {
			return res.status(404).json({ message: "Payment not found" });
		}
		
		return res.status(200).json({ message: "Payment updated", updatedPayment });
	} catch (e) {
		console.error('[UPDATE PAYMENT ERROR]', e);
		return res.status(500).json({ error: e.message });
	}
};

export const handleMidtransCallback = async (req, res) => {
	try {
		const { order_id, transaction_status, transaction_id } = req.body;
		
		const orderId = order_id.split('-')[0]; // misal "6533bc-...-timestamp"
		
		const payment = await Payment.findOneAndUpdate(
			{ orderId },
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
		
		return res.status(200).json({ message: "Callback received" });
	} catch (e) {
		console.error('[MIDTRANS CALLBACK ERROR]', e);
		return res.status(500).json({ error: e.message });
	}
};

export const deletePayment = async (req, res) => {
	try {
		const { orderId } = req.params;
		const deletedPayment = await Payment.findOneAndDelete({ orderId });
		
		if (!deletedPayment) {
			return res.status(404).json({ message: "Payment not found" });
		}
		
		return res.status(200).json({ message: "Payment deleted successfully" });
	} catch (e) {
		console.error('[DELETE PAYMENT ERROR]', e);
		return res.status(500).json({ error: e.message });
	}
};
