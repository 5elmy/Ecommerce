import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as SubCategoryController from "./controller/subCategory.controller.js"
import auth from "../../middleware/auth.middleware.js";
import { headers } from "../coupon/coupon.validation.js";
import { createSubCategory, updateSubCategory } from "./subcategory.validation.js";
import { endPoint } from "./subcategory.endPoint.js";
const router = Router({mergeParams:true})




router.get('/', (req ,res)=>{
    res.status(200).json({message:"SubCategory Module"})
})
router.post('/',
    validation(headers , true),
    auth(endPoint.create),
    fileUpload(fileValidation.image).single("image"),
    validation(createSubCategory),
    asyncHandler(SubCategoryController.createSubCategory));

router.put('/:subCategoryId',
    validation(headers , true),
    auth(endPoint.create),
    fileUpload(fileValidation.image).single("image"),
    validation(updateSubCategory),
    asyncHandler(SubCategoryController.updateSubCategory))




export default router