import * as productController from './controller/product.controller.js'
import { asyncHandler } from '../../utils/errorHandling.js';
import { Router } from "express";
import { fileUpload, fileValidation } from '../../utils/multer.js';
import auth from '../../middleware/auth.middleware.js';
import { endPoint } from './product.endPoint.js';
import { validation } from '../../middleware/validation.middleware.js';
import { createProduct, headers, updateProduct, wishList } from './product.validation.js';
import reviewRouter from "../reviews/reviews.router.js"
const router = Router()




router.use("/:productId/review", reviewRouter)

router.get('/', asyncHandler(productController.productList))




router.post('/',
    validation(headers,true),
    auth(endPoint.createProduct),
    fileUpload(fileValidation.image).fields([    
        {name:"mainImage", maxCount:1},    
        {name:"subImages", maxCount:7},
    ]),
    validation(createProduct),
    asyncHandler(productController.createProduct))

router.put('/:productId',
    validation(headers,true),
    auth(endPoint.updateProduct),
    fileUpload(fileValidation.image).fields([    
        {name:"mainImage", maxCount:1},    
        {name:"subImages", maxCount:7},
    ]),
    validation(updateProduct),
    asyncHandler(productController.updateProduct))

router.patch("/wishList/:productId",
    auth(endPoint.wishList),
    validation(wishList),
    asyncHandler(productController.wishList))

router.patch("/wishList/:productId/remove",
    auth(endPoint.wishList),
    validation(wishList),
    asyncHandler(productController.removeFromWishList))





export default router