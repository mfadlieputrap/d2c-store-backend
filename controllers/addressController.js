import checkUserExists from "../utils/checkUserExists.js";
import Address from "../models/Address.js";

export const getAllAddress = async (req, res) => {
	try{
		await checkUserExists(req.user.id);
		const addresses = await Address.find({userId: req.user.id}).lean();
		
		return res.status(200).json({ message: "List of address retrieved" , addresses});
	}catch(e){
		return res.status(500).json({ error: e.message });
	}
}

export const getAddressById = async (req, res) => {
	try {
	  const {addressId} = req.params;
		await checkUserExists(req.user.id);
		
		const address = await Address.findOne({_id: addressId, userId: req.user.id}).lean();
		if(!address){
			return res.status(404).json({ message: "Address not found" });
		}
		
		return res.status(200).json({ message: "Address detail retrieved", address });
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
}

export const addAddress = async (req, res) => {
	try{
		const data = req.body;
		await checkUserExists(req.user.id);
		
		const address = await Address.create({
			userId: req.user.id,
			...data
		});
		
		return res.status(201).json({ message: "Address added successfully", address });
	}catch(e){
		return res.status(500).json({ error: e.message });
	}
}

export const updateAddress = async (req, res) => {
	try{
		const updateData = req.body;
		const { addressId } = req.params;
		await checkUserExists(req.user.id);
		
		const prevAddress = await Address.findOne({_id: addressId, userId: req.user.id});
		if(!prevAddress){
			return res.status(404).json({ message: "Address not found" });
		}
		
		const updatedAddress = await Address.findByIdAndUpdate(addressId,{
			...updateData,
		}, {new: true, runValidators: true});
		
		return res.status(200).json({ message: "Address updated successfully", updatedAddress });
	}catch(e){
		return res.status(500).json({ error: e.message });
	}
}

export const deleteAddress = async (req, res) => {
	try{
		const { addressId } = req.params;
		await checkUserExists(req.user.id);
		
		const result = await Address.deleteOne({_id: addressId, userId: req.user.id});
		if(result.deletedCount === 0){
			return res.status(404).json({ message: "Address not found or already deleted" });
		}
		
		return res.status(200).json({ message: "Address deleted successfully" });
	}catch(e){
		return res.status(500).json({ error: e.message });
	}
}