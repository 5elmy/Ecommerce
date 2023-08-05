import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";



export const createReview = Joi.object({
    productId:generalFields.id,
    comment:Joi.string().min(3).max(5000).required(),
    rating:Joi.number().positive().min(1).max(5).required() ,

}).required()


export const updateReview = Joi.object({
    reviewId:generalFields.id,
    productId:generalFields.id,
    comment:Joi.string().min(3).max(5000).required(),
    rating:Joi.number().positive().min(1).max(5).required() ,

}).required()