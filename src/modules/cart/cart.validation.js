import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";




export const cart = Joi.object({
    productId:generalFields.id,
    quantity:Joi.number().positive().integer().min(1).required()
}).required()