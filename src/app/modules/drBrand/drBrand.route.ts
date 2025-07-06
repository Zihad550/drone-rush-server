import { Router } from "express";
import { BrandControllers } from "./drBrand.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../drUser/drUser.constant";

const router = Router();

router.get("/", BrandControllers.getBrands);
router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  BrandControllers.createBrand,
);

export const BrandRoutes = router;
