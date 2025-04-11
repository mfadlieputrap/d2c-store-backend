import checkUserExists from "../utils/checkUserExists.js";
import BankAccount from "../models/BankAccount.js";
import applyUpdateFields from "../utils/applyUpdateFields.js";
const allowedFields = ["type", "provider", "accountName", "accountNumber"];

export const getAllBankAccount = async (req, res) => {
	try {
		await checkUserExists(req.user.id);
		
		const bankAccounts = await BankAccount.find({userId: req.user.id});
		
		return res.status(200).json({
			message: "Bank accounts user retrieved",
			bankAccounts
		})
	} catch (e) {
		return res.status(500).json({error: e.message});
	}
}

export const getBankAccountById = async (req, res) => {
	try {
		await checkUserExists(req.user.id);
		const {bankAccountId} = req.params;
		const bankAccount = await BankAccount.findOne({_id: bankAccountId, userId: req.user.id});
		if(!bankAccount){
			return res.status(404).json({
				message: "Bank account not found"
			})
		}
		
		return res.status(200).json({
			message: "Bank account detail retrieved",
			bankAccount
		})
	} catch (e) {
		return res.status(500).json({error: e.message});
	}
}
export const addBankAccount = async (req, res) => {
	try {
		await checkUserExists(req.user.id);
		const {type, provider, accountName, accountNumber} = req.body;
		if(!type || !provider || !accountName || !accountNumber){
			return res.status(400).json({
				message: "All fields are required"
			})
		}
		const bankAccount = await BankAccount.create({
			userId: req.user.id,
			type,
			provider,
			accountName,
			accountNumber
		})
		return res.status(201).json({
			message: "Bank account added successfully",
			bankAccount
		})
	} catch (e) {
		return res.status(500).json({error: e.message});
	}
}


export const updateBankAccount = async (req, res) => {
	try {
		await checkUserExists(req.user.id);
		const {bankAccountId} = req.params;
		const updateData = req.body;
		
		const prevBankAccount = await BankAccount.findOne({_id: bankAccountId, userId: req.user.id});
		if(!prevBankAccount){
			return res.status(404).json({
				message: "Bank account not found"
			})
		}
		
		const updatedBankAccount = applyUpdateFields(prevBankAccount, updateData, allowedFields);
		await updatedBankAccount.save();
		
		return res.status(200).json({
			message: "Bank account updated successfully",
			updatedBankAccount
		})
	} catch (e) {
		return res.status(500).json({error: e.message});
	}
}
export const deleteBankAccount = async (req, res) => {
	try {
		await checkUserExists(req.user.id);
		const {bankAccountId} = req.params;
		
		const result = await BankAccount.findOneAndDelete({_id: bankAccountId, userId: req.user.id});
		if(!result){
			return res.status(404).json({ message: "Bank account not found or already deleted" });
		}
		
		return res.status(200).json({ message: "Bank account deleted successfully", result });
	} catch (e) {
		return res.status(500).json({error: e.message});
	}
}