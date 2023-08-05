import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";



export const createBrand=Joi.object({

    name: Joi.string().min(2).max(50).required(),
    file:generalFields.file.required()
}).required()

export const updateBrand=Joi.object({
    brandId:generalFields.id,
    name: Joi.string().min(2).max(50),
    file:generalFields.file
}).required()
