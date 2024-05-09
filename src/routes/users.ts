import express from "express";
import * as UserController from "../controllers/users";
import { userAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", userAuth, UserController.getAuthenticatedUser);

router.post("/usersignup", UserController.UserSignUp);

router.post("/userlogin", UserController.UserLogin);

router.post("/userlogout", UserController.UserLogout);

router.get("/userresetpassword/:userId", UserController.ChangePassword);

router.patch("/userresetpassword/:userId/accessToken", UserController.ChangePassword);

router.post("/userforgotpassword", UserController.ForgotPassword);

export default router;