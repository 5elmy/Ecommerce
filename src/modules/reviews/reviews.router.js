import * as reviewController from "./controller/review.controller.js"
import { Router } from "express";
import auth from "../../middleware/auth.middleware.js";
import { endPoint } from "./reviews.endPoint.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.middleware.js";
import { createReview, updateReview } from "./reviews.validation.js";

const router = Router({mergeParams:true})




router.get('/', (req ,res)=>{
    res.status(200).json({message:"reviews Module"})
})

router.post("/",auth(endPoint.create),validation(createReview),asyncHandler(reviewController.createReview))
router.patch("/:reviewId",auth(endPoint.update),validation(updateReview),asyncHandler(reviewController.updateReview))




export default router