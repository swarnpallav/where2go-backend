import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { save } from "../controllers/feedback.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/save").post(verifyJWT, upload.single("image"), save);

export default router;
