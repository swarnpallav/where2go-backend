import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { verifyAdmin } from "../../middlewares/admin.middleware.js";
import { addEditCity, addDestination, cityListing, getCityById, getOrphanCities } from "../../controllers/admin/city.admin.controller.js";

const router = Router();

router.use(verifyJWT);
router.use(verifyAdmin);

router.route("/add-edit-city").post(addEditCity);
router.route("/addDestination").post(addDestination);
router.route("/city-listing").get(cityListing);
router.route("/get-orphan-cities").get(getOrphanCities);
router.route("/:id").get(getCityById);

export default router;
