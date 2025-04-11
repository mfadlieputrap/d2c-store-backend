import express from 'express';
import {allowRoles, authJwt} from "../middleware/authMiddleware.js";
import {changePassword, deleteProfile, getProfile, updateUser} from "../controllers/userController.js";
import {updateUserValidation} from "../validators/entityValidator.js";
import handleValidator from "../middleware/handleValidator.js";
import {changePasswordValidation} from '../validators/entityValidator.js';

const router = express.Router();

router.get('/profile', authJwt, allowRoles('customer'), getProfile);
router.put('/update/', authJwt, allowRoles('customer'), ...updateUserValidation, handleValidator, updateUser);
router.put('/change-password', ...changePasswordValidation, handleValidator, changePassword);
router.delete('/delete', authJwt, allowRoles('customer'), deleteProfile);

export default router;