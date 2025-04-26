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

router.post('/add', ...bankAccountValidation(), handleValidator, addBankAccount);
router.get('/', getAllBankAccount);
router.put('/update/:bankAccountId', ...bankAccountValidation(true), handleValidator, updateBankAccount);
router.delete('/delete/:bankAccountId', deleteBankAccount);
router.get('/:bankAccountId', getBankAccountById);

export default router;