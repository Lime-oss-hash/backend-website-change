import express from "express";
import * as RegistersControllers from "../controllers/registers";
import { getAuthenticatedStaff } from "../middleware/auth";

const router = express.Router();

router.get("/", getAuthenticatedStaff, RegistersControllers.getRegisters);

router.get("/:registerId", getAuthenticatedStaff, RegistersControllers.getRegister);

router.post("/", RegistersControllers.createRegister);

router.delete("/rejected/:registerId", getAuthenticatedStaff, RegistersControllers.deleteRegisterWithEmail);

router.delete("/approved/:registerId", getAuthenticatedStaff, RegistersControllers.deleteRegisterWithoutEmail);

export default router;