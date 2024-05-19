import { Router } from "express";
import { getAllStates } from "../controllers/state.controller.js";

const router = Router();

router.route("/getAllStates").get(getAllStates);

export default router;
