import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { verifyAdmin } from "../../middlewares/admin.middleware.js";
import { addState } from "../../controllers/admin/state.admin.controller.js";

const router = Router();

router.use(verifyJWT);
router.use(verifyAdmin);

router.route("/add").post(addState);

export default router;
