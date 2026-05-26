import {Router} from "express";
import {registerUser,login,logoutUser, refreshAccessToken, forgotPasswordRequest, resetForgotPassword, getCurrentUser, changeCurrentPassword} from "../controllers/auth.controllers.js";
import {validate} from "../middlewares/validator.middleware.js";
import { userLoginValidator, userRegisterValidator,userForgotPasswordValidator, userResetForgotPasswordValidator, userChangeCurrentPasswordValidator } from "../validators/index.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
const router = Router();
// unsecured routes
router.route("/register").post(userRegisterValidator(),validate,registerUser);
// first we are validating if it is correct or not then passing to middleware (validate) if right then registerUser
router.route("/login").post(userLoginValidator(),validate,login);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password").post(userForgotPasswordValidator(),validate,forgotPasswordRequest)
router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(),validate,resetForgotPassword);
// secure routes
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/current-user").get(verifyJWT,getCurrentUser);
router.route("/change-password").post(verifyJWT,userChangeCurrentPasswordValidator(),validate,changeCurrentPassword);

export default router;