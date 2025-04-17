import express from 'express';
import {allowRoles, authJwt} from "../middleware/authMiddleware.js";
import {changePassword, deleteProfile, getProfile, updateUser} from "../controllers/userController.js";
import {updateUserValidation} from "../validators/entityValidator.js";
import handleValidator from "../middleware/handleValidator.js";
import {changePasswordValidation} from '../validators/entityValidator.js';
import checkUserExists from "../utils/checkUserExists.js";

const router = express.Router();

router.get('/profile', authJwt, allowRoles('customer'), checkUserExists, getProfile);
router.put('/update/', authJwt, checkUserExists, allowRoles('customer'), ...updateUserValidation, handleValidator, updateUser);
router.put('/change-password', authJwt, checkUserExists, allowRoles('customer'), ...changePasswordValidation, handleValidator, changePassword);
router.delete('/delete', authJwt, checkUserExists, allowRoles('customer'), deleteProfile);

export default router;