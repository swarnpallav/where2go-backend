import { Router } from "express";
import {
	addDestinationSite,
	getDestinationSiteById,
} from "../controllers/destinationSite.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/:id").get(getDestinationSiteById);

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
