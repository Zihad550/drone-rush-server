import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { CategoryControllers } from "./category.controller";

const router = Router();

router.get("/", CategoryControllers.getCategories);
router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  CategoryControllers.createCategory,
);

router.get("/:id/drones", CategoryControllers.getDronesByCategory);

export const CategoryRoutes = router;
