import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { verifyAdmin } from "../../middlewares/admin.middleware.js";
import {
	addEditState,
	getStateById,
	stateListing,
} from "../../controllers/admin/state.admin.controller.js";

const router = Router();

router.use(verifyJWT);
router.use(verifyAdmin);

router.route("/add-edit-state").post(addEditState);
router.route("/state-listing").get(stateListing);
router.route("/:id").get(getStateById);

export default router;
