import { Router } from "express";
import {
	getDestinationSiteById,
	getDestinationsByCityId,
	like,
} from "../controllers/destinationSite.controller.js";

const router = Router();

router.route("/:id").get(getDestinationSiteById);

router.route("/getDestinationsByCityId/:id").get(getDestinationsByCityId);

router.route("/like").patch(like);

export default router;
