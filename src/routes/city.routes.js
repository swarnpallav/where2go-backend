import { Router } from "express";
import { addCity } from "../controllers/city.controller.js";

const router = Router();

router.route("/add").post(addCity);

router.route("/getDestinations/:id").get();

export default router;
