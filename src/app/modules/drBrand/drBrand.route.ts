import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../drUser/drUser.constant";
import { BrandControllers } from "./drBrand.controller";

const router = Router();

router.get("/", BrandControllers.getBrands);
router.post(
	"/",
	auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
	BrandControllers.createBrand,
);

export const BrandRoutes = router;
