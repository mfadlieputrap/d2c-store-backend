import express from 'express';
import {
	createPayment,
	getPaymentByOrderId,
	getAllPayments,
	updatePaymentStatus,
	handleMidtransCallback, deletePayment
} from '../controllers/paymentController.js';


import handleValidator from '../middleware/handleValidator.js';
import { authJwt, allowRoles } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post(
	'/create',
	authJwt,
	allowRoles(['admin']),
	createPayment
);

router.get(
	'/',
	authJwt,
	allowRoles('admin'),
	getAllPayments
);

router.get(
	'/:orderId',
	authJwt,
	allowRoles(['admin', 'customer']),
	getPaymentByOrderId
);

router.put(
	'/:orderId/status',
	authJwt,
	allowRoles(['admin']),
	updatePaymentStatus
);

router.post('/midtrans/callback', handleMidtransCallback);

router.delete('/delete/:orderId', authJwt, allowRoles(['admin']), deletePayment);

export default router;
