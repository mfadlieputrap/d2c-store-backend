import express from 'express';
import {
	createPayment,
	getPaymentByOrderId,
	getAllPayments,
	updatePaymentStatus,
	handleMidtransCallback
} from '../controllers/paymentController.js';

import {
	createPaymentValidation,
	getPaymentByOrderIdValidation,
	updatePaymentStatusValidation
} from '../validators/entityValidator.js';

import handleValidator from '../middleware/handleValidator.js';
import { authJwt, allowRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Buat payment (biasanya hanya admin/backend yang boleh buat manual)
router.post(
	'/',
	authJwt,
	allowRoles('admin'), // atau 'seller' juga bisa, tergantung rules di projectmu
	...createPaymentValidation,
	handleValidator,
	createPayment
);

// ✅ Ambil semua payment (biasanya admin)
router.get(
	'/',
	authJwt,
	allowRoles('admin'),
	getAllPayments
);

// ✅ Ambil detail payment by orderId (bisa admin, atau buyer kalau mau disesuaikan)
router.get(
	'/:orderId',
	authJwt,
	allowRoles('admin', 'buyer'),
	...getPaymentByOrderIdValidation,
	handleValidator,
	getPaymentByOrderId
);

// ✅ Update status pembayaran (misal untuk mark sebagai refund/expired dsb)
router.patch(
	'/:orderId/status',
	authJwt,
	allowRoles('admin'),
	...updatePaymentStatusValidation,
	handleValidator,
	updatePaymentStatus
);

// ✅ Midtrans callback endpoint (tidak perlu auth, tapi amankan pakai signature validation)
router.post('/midtrans/callback', handleMidtransCallback);

export default router;
