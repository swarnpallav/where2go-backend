import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addReview } from "../controllers/review.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/add").post(
	verifyJWT,
	upload.fields({
		name: "images",
		maxCount: 10,
	}),
	addReview
);

export default router;
