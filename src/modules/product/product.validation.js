import Joi from "joi";
import { generalFields, optionGeneralFields } from "../../middleware/validation.middleware.js";

export const headers= generalFields.headers.required()


export const createProduct= Joi.object({
    name:Joi.string().min(2).max(25).required(),
    description:Joi.string().min(2).max(5000),
    price:Joi.number().positive().min(1).required(),
    discount:Joi.number().positive().min(1),
    stock:Joi.number().integer().positive().min(1).required(),
    colors:Joi.array(),
    size:Joi.array(),
    file:Joi.object({
        mainImage:Joi.array().items(generalFields.file).length(1).required(),
        subImages:Joi.array().items(generalFields.file).max(5),
    }).required(),
    brandId:generalFields.id,
    subCategoryId:generalFields.id,
    categoryId:generalFields.id,
}).required()

export const updateProduct= Joi.object({
    productId:generalFields.id,
    name:Joi.string().min(2).max(25),
    description:Joi.string().min(2).max(5000),
    price:Joi.number().positive().min(1),
    discount:Joi.number().positive().min(1),
    stock:Joi.number().integer().positive().min(1),
    colors:Joi.array(),
    size:Joi.array(),
    file:Joi.object({
        mainImage:Joi.array().items(generalFields.file).length(1),
        subImages:Joi.array().items(generalFields.file).max(5),
    }),
    brandId:optionGeneralFields.id,
    subCategoryId:optionGeneralFields.id,
    categoryId:optionGeneralFields.id,
}).required()

export const wishList= Joi.object({
    productId:generalFields.id
}).required()

export const graphQlupdateStock= Joi.object({
    id:generalFields.id,
    stock:Joi.number().positive().min(1).integer().required(),
    authorization:Joi.string().required(),
}).required()
