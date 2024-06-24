import { Router } from "express";
import { getCitiesByStateId } from "../controllers/city.controller.js";

const router = Router();

router.route("/getCitiesByStateId/:id").get(getCitiesByStateId);

export default router;
