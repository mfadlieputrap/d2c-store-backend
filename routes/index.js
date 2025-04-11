import express from 'express';
import userRoute from "./userRoute.js";
import authRoute from "./authRoute.js";
import addressRoute from "./addressRoute.js";
import bankAccountRoute from "./bankAccountRoute.js";
const router = express.Router();

router.use('/user', userRoute);
router.use('/auth', authRoute);
router.use('/address', addressRoute);
router.use('/bank-account', bankAccountRoute);

export default router;