import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.middleware.js";
import { forgetPassword, login, resetPassword, signUp, token } from "./auth.validation.js";

import * as authController from "./controller/registration.controller.js"


const router = Router()


router.get("/",authController.getusers) ;
  router.post("/signup",validation(signUp) ,asyncHandler(authController.signUp)) ;
  router.post("/login",validation(login) ,asyncHandler(authController.login)) ;
  router.get("/confirmEmail/:token", validation(token), asyncHandler(authController.confirmEmail)) ;
  router.get("/newconfirmEmail/:token", validation(token) ,asyncHandler(authController.newConfirmEmail)) ;
  // not validation
  router.patch("/forgetPassword",validation(forgetPassword),asyncHandler(authController.forgetPassword)) 
  router.patch("/resetPassword",validation(resetPassword),asyncHandler(authController.resetPassword)) 






export default router

