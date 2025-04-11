import express from 'express';
import {allowRoles, authJwt} from "../middleware/authMiddleware.js";
import {addressValidation} from "../validators/entityValidator.js";
import handleValidator from "../middleware/handleValidator.js";
import {
	addAddress,
	deleteAddress,
	getAddressById,
	getAllAddress,
	updateAddress
} from "../controllers/addressController.js";
const router = express.Router();

router.post('/add', authJwt, allowRoles('customer'), ...addressValidation, handleValidator, addAddress);
router.put('/update/:id', authJwt, allowRoles('customer'), ...addressValidation, handleValidator, updateAddress);
router.delete('/delete/:id', authJwt, allowRoles('customer'), deleteAddress);
router.get('/', authJwt, allowRoles('customer'), getAllAddress);
router.get('/:id', authJwt, allowRoles('customer'), getAddressById);

export default router;