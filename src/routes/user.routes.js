import { Router } from "express";
import { signUp, login, logout, userInfo, verifyEmail } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/sign-up").post(upload.single("avatar"), signUp);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);
router.route("/user-info").get(verifyJWT, userInfo);
router.route("/verify-email").post(verifyEmail);

export default router;
