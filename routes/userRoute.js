import express from 'express';
import {allowRoles, authJwt} from "../middleware/authMiddleware.js";
import {changePassword, deleteProfile, getProfile, updateUser} from "../controllers/userController.js";
import {updateUserValidation} from "../validators/entityValidator.js";
import handleValidator from "../middleware/handleValidator.js";
import {changePasswordValidation} from '../validators/entityValidator.js';
import checkUserExists from "../utils/checkUserExists.js";

const router = express.Router();

router.get('/profile', getProfile);
router.put('/update/', ...updateUserValidation, handleValidator, updateUser);
router.put('/change-password', ...changePasswordValidation, handleValidator, changePassword);
router.delete('/delete', deleteProfile);

export default router;