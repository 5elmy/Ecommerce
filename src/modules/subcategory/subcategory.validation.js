import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";



export const createSubCategory=Joi.object({
    categoryId:generalFields.id,
    name: Joi.string().min(2).max(50).required(),
    file:generalFields.file.required()
}).required()

export const updateSubCategory=Joi.object({
    categoryId:generalFields.id,
    subCategoryId:generalFields.id,
    name: Joi.string().min(2).max(50),
    file:generalFields.file
}).required()