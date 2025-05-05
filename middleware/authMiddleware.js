import jwt from "jsonwebtoken";
import checkUserExists from "../utils/checkUserExists.js";

export const authJwt = async (req, res, next) => {
	try{
		const authHeader= req.headers.authorization;
		
		if( !authHeader || !authHeader.startsWith('Bearer ') ){
			return res.status(401).json({ error: "Access token missing or invalid"});
		}
		
		const token = authHeader.split(" ")[1];
		req.user = await jwt.verify(token, process.env.JWT_SECRET);
		console.log(req.user);
		next();
	}catch(e){
		console.error('Verify Token Error: ', e.message);
		return res.status(500).json({ error: e.message });
	}
}

export const allowRoles = (role) => {
	return (req, res, next) => {
		console.log("Checking roles");
		if(!role.includes(req.user.role)){
			return res.status(403).json({ message: "Forbidden: Access denied!" })
		}
		
		next();
	}
}