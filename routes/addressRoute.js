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

router.post('/add', ...addressValidation, handleValidator, addAddress);
router.put('/update/:addressId', updateAddress);
router.delete('/delete/:addressId', deleteAddress);
router.get('/', getAllAddress);
router.get('/:addressId', getAddressById);

export default router;