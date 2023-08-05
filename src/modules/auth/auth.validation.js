import Joi from "joi";
import { generalFields, optionGeneralFields } from "../../middleware/validation.middleware.js";



export const signUp= Joi.object({
    userName:optionGeneralFields.userName.required(),
    email:generalFields.email,
    password:generalFields.password,
    confirmEmail:generalFields.confirmPassword.valid(Joi.ref("password")),
    role:optionGeneralFields.role.valid("User","Admin").required()
}).required();

export const login= Joi.object({
    email:generalFields.email,
    password:generalFields.password,
}).required();
export const forgetPassword= Joi.object({
    email:generalFields.email

}).required();

export const resetPassword= Joi.object({
    code:Joi.string().pattern(new RegExp(/^[0-9]{4}$/)).required(),
    email:generalFields.email,
    password:generalFields.password,
    confirmPassword:generalFields.confirmPassword.valid(Joi.ref("password")),

}).required();

export const token = Joi.object({
   token:Joi.string().required()
}).required();
