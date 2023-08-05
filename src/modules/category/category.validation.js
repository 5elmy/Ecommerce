
import Joi from 'joi'
import { generalFields } from '../../middleware/validation.middleware.js'


export const headers= generalFields.headers.required()

export const createCategory = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    file:generalFields.file.required(),

}).required()


export const updateCategory = Joi.object({
    categoryId:generalFields.id,
    name: Joi.string().min(2).max(50),
    file:generalFields.file
}).required();