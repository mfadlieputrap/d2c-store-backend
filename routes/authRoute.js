import express from 'express';
import {loginValidation, registerValidation} from "../validators/authValidator.js";
import handleValidator from "../middleware/handleValidator.js";
import {loginUser, registerUser} from "../controllers/authController.js";
import {changePassword} from "../controllers/userController.js";
const router = express.Router();

router.post('/register', ...registerValidation, handleValidator, registerUser);
router.post('/login', ...loginValidation, handleValidator, loginUser);

export default router;