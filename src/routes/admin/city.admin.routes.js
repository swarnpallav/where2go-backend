import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { verifyAdmin } from "../../middlewares/admin.middleware.js";
import { addCity, addDestination, cityListing, getOrphanCities } from "../../controllers/admin/city.admin.controller.js";

const router = Router();

router.use(verifyJWT);
router.use(verifyAdmin);

router.route("/add").post(addCity);
router.route("/addDestination").post(addDestination);
router.route("/city-listing").get(cityListing);
router.route("/get-orphan-cities").get(getOrphanCities)

export default router;
