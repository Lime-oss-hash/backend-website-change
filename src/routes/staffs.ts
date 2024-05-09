import express from "express";
import * as StaffController from "../controllers/staffs";
import { getAuthenticatedStaff } from "../middleware/auth";

const router = express.Router();

router.get("/", getAuthenticatedStaff, StaffController.getAuthenticatedStaff);

router.post("/staffsignup", StaffController.StaffSignUp);

router.post("/stafflogin", StaffController.StaffLogin);

router.post("/stafflogout", StaffController.StaffLogout);

export default router;