import express from "express";
import * as RostersController from "../controllers/rosters";

const router = express.Router();

router.get("/", RostersController.getRosters);

router.get("/:rosterId", RostersController.getRoster);

router.post("/", RostersController.createRoster);

router.patch("/:rosterId", RostersController.updateRoster);

router.delete("/:rosterId", RostersController.deleteRoster);

export default router;