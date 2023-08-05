import Joi from 'joi'
import { Types } from 'mongoose'


// validation middleware 
export const validation = (schema , considerHeaders= false) => {
    return (req, res, next) => {

        let inputs = { ...req.body, ...req.query, ...req.params }
        if (req.headers?.authorization && considerHeaders ) {   // considerHeaders == true
            inputs={authorization : req.headers.authorization}
        }
    
        if (req.file || req.files) {
            inputs.file = req.file || req.files
        }
    
        console.log(inputs);
        const validationResult = schema.validate(inputs, { abortEarly: false })
        if (validationResult.error) {
            return res.json({ message: "Validation Err", validationResult: validationResult.error.details })
        }
        return next()
    }
}
// GraphQL validation middleware 
export const graphQLValidation = async (schema,inputs) => {
        const {error} = schema.validate(inputs, { abortEarly: false })
        if (error) {
             throw Error(error)
        }
        return true
}

// id validation 
const validateObjectId = (value, helper) => {
    return Types.ObjectId.isValid(value) ? true : helper.message('In-valid objectId')
}

// most validation  in general that is required
export const generalFields = {
   
    email: Joi.string().email({ minDomainSegments: 2,maxDomainSegments: 4, tlds: { allow: ['com', 'net',] }}).required(),

    password: Joi.string().pattern(new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    confirmPassword: Joi.string().required(),

    id: Joi.string().custom(validateObjectId).required(),

    file: Joi.object({
        size: Joi.number().positive().required(),
        path: Joi.string().required(),
        filename: Joi.string().required(),
        destination: Joi.string().required(),
        mimetype: Joi.string().required(),
        encoding: Joi.string().required(),
        originalname: Joi.string().required(),
        fieldname: Joi.string().required()
    }),
    headers:Joi.object({
        authorization:Joi.string().required()
    })
}

// option required  validation 
export const optionGeneralFields={
    userName:Joi.string().min(2).max(25),
    role:Joi.string().alphanum(),
    id: Joi.string().custom(validateObjectId),

}