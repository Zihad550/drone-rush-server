import { Router } from "express";
import { CategoryControllers } from "./drCategory.controller";

const router = Router();

router.get("/", CategoryControllers.getCategories);
router.post("/", CategoryControllers.createCategory);

export const CategoryRoutes = router;
