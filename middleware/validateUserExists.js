import checkUserExists from "../utils/checkUserExists.js";

const validateUserExists = async (req, res, next)=>{
	try {
		req.userData = await checkUserExists(req.user.id);
		next();
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
	
}

export default validateUserExists;