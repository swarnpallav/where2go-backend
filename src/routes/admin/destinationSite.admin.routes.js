import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { verifyAdmin } from "../../middlewares/admin.middleware.js";
import { addDestinationSite } from "../../controllers/admin/destinationSite.admin.controller.js";

const router = Router();

router.use(verifyJWT);
router.use(verifyAdmin);

router.route("/add").post(
	upload.fields([
		{
			name: "images",
			maxCount: 10,
		},
	]),
	addDestinationSite
);

export default router;
