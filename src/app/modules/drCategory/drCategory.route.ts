import { Router } from "express";
import { CategoryControllers } from "./drCategory.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../drUser/drUser.constant";

const router = Router();

router.get("/", CategoryControllers.getCategories);
router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  CategoryControllers.createCategory,
);

export const CategoryRoutes = router;
