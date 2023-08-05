import * as categoryController from './controller/category.js'
import * as validators from './category.validation.js'
import { validation } from '../../middleware/validation.middleware.js';
import { fileUpload, fileValidation } from '../../utils/multer.js'
import SubCategoryRouter from '../subcategory/subcategory.router.js'
import { Router } from "express";
import { asyncHandler } from '../../utils/errorHandling.js';
import auth, { roles } from '../../middleware/auth.middleware.js';
import { endPoint } from './category.endPoint.js';
const router = Router()


router.use("/:categoryId/subCategory",SubCategoryRouter)
router.get('/' ,asyncHandler(categoryController.categoryList)) //,auth(Object.values(roles)) ----==> for if we need for only authorization users see categories



router.post('/',
    validation(validators.headers , true),
    auth(endPoint.create),
    fileUpload(fileValidation.image).single('image'),
    validation(validators.createCategory),
    asyncHandler(categoryController.createCategory))



router.put('/:categoryId',
    validation(validators.headers , true),
    auth(endPoint.update),
    fileUpload(fileValidation.image).single('image'),
    validation(validators.updateCategory),
    asyncHandler(categoryController.updateCategory))


export default router