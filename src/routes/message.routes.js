import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addMessage, getLatestMessages } from "../controllers/message.controller.js";

const router = Router();

router.route("/add").post(verifyJWT, addMessage);
router.route("/get-latest-messages").get(getLatestMessages);

export default router;
