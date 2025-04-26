import express from 'express';
import userRoute from "./userRoute.js";
import authRoute from "./authRoute.js";
import addressRoute from "./addressRoute.js";
import bankAccountRoute from "./bankAccountRoute.js";
import cartRoute from "./cartRoute.js";
import {allowRoles, authJwt} from "../middleware/authMiddleware.js";
import productRoute from "./productRoute.js";
import wishlistRoute from "./wishlistRoute.js";
import checkUserExists from "../utils/checkUserExists.js";
import orderRoute from "./orderRoute.js";
import paymentRoute from "./paymentRoute.js";
import categoryRoute from "./categoryRoute.js";
const router = express.Router();

router.use('/user', authJwt, checkUserExists, allowRoles(['customer']), userRoute);
router.use('/products', productRoute);
router.use('/wishlists', authJwt, checkUserExists, allowRoles(['customer']), wishlistRoute);
router.use('/auth', authRoute);
router.use('/address', authJwt, checkUserExists, allowRoles(['customer']), addressRoute);
router.use('/bank-accounts', authJwt, checkUserExists, allowRoles(['customer']), bankAccountRoute);
router.use('/cart', authJwt, checkUserExists, allowRoles(['customer']) ,cartRoute);
router.use('/orders', orderRoute);
router.use('/payments', paymentRoute);
router.use('/categories', authJwt, checkUserExists, allowRoles(['admin']), categoryRoute);

export default router;