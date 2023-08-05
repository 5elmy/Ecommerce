import * as cartController from './controller/cart.controller.js'
import { Router } from "express";
import { asyncHandler } from '../../utils/errorHandling.js';
import auth from '../../middleware/auth.middleware.js';
import { endPoint } from './cart.endPoint.js';
import { validation } from '../../middleware/validation.middleware.js';
import { headers } from '../product/product.validation.js';
import { cart } from './cart.validation.js';

const router = Router()




router.post('/' ,
    validation(headers,true) ,
    auth(endPoint.create),
    validation(cart) ,
    asyncHandler( cartController.addCart))

    
router.patch('/',auth(endPoint.create),asyncHandler(cartController.clearCart))
router.patch('/selectedRemove',auth(endPoint.create),asyncHandler(cartController.clearItemsFromCart))




export default router