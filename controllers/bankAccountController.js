import checkUserExists from "../utils/checkUserExists.js";
import BankAccount from "../models/BankAccount.js";
import applyUpdateFields from "../utils/applyUpdateFields.js";
import {responseFormat} from "../utils/responseHelper.js";
const allowedFields = ["type", "provider", "accountName", "accountNumber"];

export const getAllBankAccount = async (req, res) => {
	try {
		const bankAccounts = await BankAccount.find({userId: req.user.id});
		
		return responseFormat(res, 200, "Bank accounts user retrieved", bankAccounts);
	} catch (e) {
		console.error('[GET BANK ACCOUNTS ERROR] ', e.message);
		return responseFormat(res, 500, error.message);
	}
}

export const getBankAccountById = async (req, res) => {
	try {
		const {bankAccountId} = req.params;
		const bankAccount = await BankAccount.findOne({_id: bankAccountId, userId: req.user.id});
		console.log(req.params);
		if(!bankAccount){
			return responseFormat(res, 404, "Bank account not found");
		}
		
		return responseFormat(res, 200, "Bank account detail retrieved", bankAccount);
	} catch (e) {
		console.error('[GET BANK ACCOUNT BY ID ERROR] ', e.message);
		return responseFormat(res, 500, error.message);
	}
}
export const addBankAccount = async (req, res) => {
	try {
		const {type, provider, accountName, accountNumber} = req.body;
		console.log(!type, !provider, !accountName, !accountNumber)
		if(!type || !provider || !accountName || !accountNumber){
			return responseFormat(res, 400, "All field are required");
		}
		const bankAccount = await BankAccount.create({
			userId: req.user.id,
			type,
			provider,
			accountName,
			accountNumber
		})
		return responseFormat(res, 201, "Bank account added successfully", bankAccount);
	} catch (e) {
		console.error('[ADD BANK ACCOUNT ERROR] ', e.message);
		return responseFormat(res, 500, error.message);
	}
}


export const updateBankAccount = async (req, res) => {
	try {
		const {bankAccountId} = req.params;
		const updateData = req.body;
		
		const prevBankAccount = await BankAccount.findOne({_id: bankAccountId, userId: req.user.id});
		if(!prevBankAccount){
			return responseFormat(res, 404, "Bank account not found");
		}
		
		const bankAccount = applyUpdateFields(prevBankAccount, updateData, allowedFields);
		await bankAccount.save();
		
		return responseFormat(res, 200, "Bank account updated succeessfully", bankAccount);
	} catch (e) {
		console.error('[UPDATE BANK ACCOUNT ERROR] ', e.message);
		return responseFormat(res, 500, error.message);
	}
}
export const deleteBankAccount = async (req, res) => {
	try {
		const {bankAccountId} = req.params;
		
		const result = await BankAccount.findOneAndDelete({_id: bankAccountId, userId: req.user.id});
		if(!result){
			return responseFormat(res, 404, "Bank account not found or already deleted");
		}
		
		return responseFormat(res, 200, "Bank account deleted successfully", result);
	} catch (e) {
		console.error('[DELETE BANK ACCOUNT ERROR] ', e.message);
		return responseFormat(res, 500, error.message);
	}
}