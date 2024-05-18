import { Router } from "express";
import { markAsAdmin } from "../../controllers/admin/user.admin.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { verifyAdmin } from "../../middlewares/admin.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(verifyAdmin);

router.route("/markAsAdmin/:id").post(markAsAdmin);

export default router;
