import { Router } from "express";
import {
	addDestinationSite,
	getDestinationSiteById,
	getDestinationsByCityId,
	like,
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

router.route("/getDestinationsByCityId/:id").get(getDestinationsByCityId);

router.route("/like").patch(like)

export default router;
