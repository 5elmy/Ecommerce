import { Router } from "express";
 import { validation } from "../../middleware/validation.middleware.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { createBrand, updateBrand } from "./brand.validation.js";
import * as brandController from "./controller/brand.controller.js"
import auth from "../../middleware/auth.middleware.js";
import { endPoint } from "./brand.endPoint.js";
const router = Router()




router.post("/",
    auth(endPoint.create)    ,
    fileUpload(fileValidation.image).single("image"),
    validation(createBrand),
    brandController.createBrand)


router.put("/:brandId",
    auth(endPoint.update),
    fileUpload(fileValidation.image).single("image"),
    validation(updateBrand),
    brandController.updateBrand)




export default router


