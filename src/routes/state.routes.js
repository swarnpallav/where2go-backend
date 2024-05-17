import { Router } from "express";
import { addState, getAllStates } from "../controllers/state.controller.js";

const router = Router();

router.route("/getAllStates").get(getAllStates);
router.route("/add").post(addState);

export default router;
