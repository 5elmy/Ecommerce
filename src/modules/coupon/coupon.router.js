import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as couponController from "./controller/coupon.controller.js"
import { createCoupon, headers, updateCoupon } from "./coupon.validation.js";
import auth from "../../middleware/auth.middleware.js";
import { endPoint } from "./coupon.endPoint.js";
const router = Router()




// router.get('/', (req ,res)=>{
//     res.status(200).json({message:"Coupon Module"})
// })

router.post("/",
    validation(headers , true),
    auth(endPoint.create),
    fileUpload(fileValidation.image).single("image"),
    validation(createCoupon),
    couponController.createCoupon)

router.put("/:couponId",
    validation(headers , true),
    auth(endPoint.create),
    fileUpload(fileValidation.image).single("image"),
    validation(updateCoupon),
    couponController.updateCoupon)




export default router