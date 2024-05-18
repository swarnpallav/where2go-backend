import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addMessage } from "../controllers/message.controller.js";

const router = Router();

router.route("/add").post(verifyJWT, addMessage);

export default router;
