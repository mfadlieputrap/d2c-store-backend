import express from 'express';
import {allowRoles, authJwt} from "../middleware/authMiddleware.js";
import {
	cancelOrder,
	createOrder,
	getAllOrders,
	getAllOrdersByUserId,
	getOrderById,
	updateOrderStatus
} from "../controllers/orderController.js";
import checkUserExists from "../utils/checkUserExists.js";
const router = express.Router();

router.post('/create', authJwt, checkUserExists, allowRoles(['customer']), createOrder);
router.get('/', authJwt, checkUserExists, allowRoles(['admin']), getAllOrders);
router.get('/me', authJwt, checkUserExists, allowRoles(['customer']), getAllOrdersByUserId);
router.get('/:orderId', authJwt, checkUserExists, allowRoles(['customer', 'admin']), getOrderById);
router.put('/update/status/:orderId', authJwt, checkUserExists, allowRoles(['admin']), updateOrderStatus);
router.put('/cancel/:orderId', authJwt, checkUserExists, allowRoles(['customer']), cancelOrder);

export default router;