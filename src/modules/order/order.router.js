import * as orderController from './controller/order.controller.js'
import { asyncHandler } from '../../utils/errorHandling.js';
import { Router } from "express";
import { endPoint } from './order.endPoint.js';
import auth from '../../middleware/auth.middleware.js';
const router = Router()




router.post('/',
    auth(endPoint.create),
    asyncHandler(orderController.createOrder))
router.patch('/:orderId/cancel',
    auth(endPoint.cancel),
    asyncHandler(orderController.cancelOrder))
router.patch('/:orderId/delivered',
    auth(endPoint.delivered),
    asyncHandler(orderController.deliverOrder))




export default router