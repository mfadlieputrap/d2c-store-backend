import express from 'express';
import {allowRoles, authJwt} from "../middleware/authMiddleware.js";
import {bankAccountValidation} from "../validators/entityValidator.js";
import handleValidator from "../middleware/handleValidator.js";
import {
	addBankAccount,
	deleteBankAccount,
	getAllBankAccount, getBankAccountById,
	updateBankAccount
} from "../controllers/bankAccountController.js";
const router = express.Router();

router.post('/add', authJwt, allowRoles('customer'), ...bankAccountValidation, handleValidator, addBankAccount);
router.get('/', authJwt, allowRoles('customer'), getAllBankAccount);
router.put('/update/:id', authJwt, allowRoles('customer', ...bankAccountValidation, handleValidator, updateBankAccount));
router.delete('/delete/:id', authJwt, allowRoles('customer'), deleteBankAccount);
router.get('/:id', authJwt, allowRoles('customer'), getBankAccountById);

export default router;