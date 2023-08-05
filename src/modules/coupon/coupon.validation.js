import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";



export const headers= generalFields.headers.required()

export const createCoupon=Joi.object({
    // categoryId:generalFields.id,
    name: Joi.string().min(2).max(50).required(),
    amount:Joi.string().min(1).max(100).required(),
    expire:Joi.date().required().greater(Date.now()),
    file:generalFields.file,
 
}).required();


export const updateCoupon=Joi.object({
    couponId:generalFields.id,
    name: Joi.string().min(2).max(50),
    amount: Joi.number().min(1).max(100),
    expire:Joi.date().greater(Date.now()),
    file:generalFields.file
}).required()