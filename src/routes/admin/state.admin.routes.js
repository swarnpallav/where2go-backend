import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { verifyAdmin } from "../../middlewares/admin.middleware.js";
import { addState, stateListing } from "../../controllers/admin/state.admin.controller.js";

const router = Router();

router.use(verifyJWT);
router.use(verifyAdmin);

router.route("/add").post(addState);
router.route("/state-listing").get(stateListing);

export default router;
