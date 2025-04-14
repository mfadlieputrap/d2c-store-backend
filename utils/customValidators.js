import mongoose from "mongoose";
import {body} from "express-validator";

export const mongoIdValidator = (field) =>
	body(field)
		.notEmpty().withMessage(`${field} is required`)
		.isMongoId().withMessage(`Invalid format for ${field}`)
		.custom((val) => mongoose.Types.ObjectId.isValid(val)).withMessage(`${field} is not a valid MongoDB ObjectId`);
