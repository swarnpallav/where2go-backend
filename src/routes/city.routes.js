import { Router } from "express";
import { getCitiesByStateId, getCityById } from "../controllers/city.controller.js";

const router = Router();

router.route("/getCitiesByStateId/:id").get(getCitiesByStateId);

router.route("/:id").get(getCityById);

export default router;
