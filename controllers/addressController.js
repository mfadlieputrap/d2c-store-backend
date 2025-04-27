import checkUserExists from "../utils/checkUserExists.js";
import Address from "../models/Address.js";
import applyUpdateFields from "../utils/applyUpdateFields.js";
import {responseFormat} from "../utils/responseHelper.js";
const allowFields = ["label", "recipientName", "street", "city", "province", "postalCode", "phoneNumber"]

export const getAllAddress = async (req, res) => {
	try{
		const addresses = await Address.find({userId: req.user.id}).lean();
		
		return responseFormat(res, 200, "List of user address retrieved", addresses);
	}catch(e){
		console.error('[GET ADDRESSES ERROR] ', e.message);
		return responseFormat(res, 500, error.message);
	}
}

export const getAddressById = async (req, res) => {
	try {
	  const {addressId} = req.params;
		
		const address = await Address.findOne({_id: addressId, userId: req.user.id}).lean();
		if(!address){
			return responseFormat(res, 404, "Address not found");
		}
		
		return responseFormat(res, 200, "User address detail retrieved", address);
	} catch (e) {
		console.error('[GET ADDRESS BY ID ERROR] ', e.message);
		return responseFormat(res, 500, error.message);
	}
}

export const addAddress = async (req, res) => {
	try{
		const data = req.body;
		
		const address = await Address.create({
			userId: req.user.id,
			...data
		});
		
		return responseFormat(res, 201, "User added address successfully", address);
	}catch(e){
		console.error('[ADD ADDRESS ERROR] ', e.message);
		return responseFormat(res, 500, error.message);
	}
}

export const updateAddress = async (req, res) => {
	try{
		const updateData = req.body;
		const { addressId } = req.params;
		
		const updatedAddress = applyUpdateFields({}, updateData, allowFields);
		const address = await Address.findOneAndUpdate({_id: addressId, userId: req.user.id}, {
			$set: updatedAddress
		}, { new: true, runValidators: true});
		if(!address){
			return responseFormat(res, 404, "User address not found");
		
		}
		
		return responseFormat(res, 200, "User address updated successfully", updatedAddress);
	}catch(e){
		console.error('[UPDATE ADDRESS ERROR] ', e.message);
		return responseFormat(res, 500, error.message);
	}
}

export const deleteAddress = async (req, res) => {
	try{
		const { addressId } = req.params;
		
		const result = await Address.findOneAndDelete({_id: addressId, userId: req.user.id});
		if(!result){
			return responseFormat(res, 404, "Address not found or already deleted");
		}
		
		return responseFormat(res, 200, "User address deleted successfully");
	}catch(e){
		console.error('[DELETE ADDRESS ERROR] ', e.message);
		return responseFormat(res, 500, error.message);
	}
}