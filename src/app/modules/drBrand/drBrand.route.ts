import { Router } from "express";
import { BrandControllers } from "./drBrand.controller";

const router = Router();

router.get("/", BrandControllers.getBrands);
router.post("/", BrandControllers.createBrand);

export const BrandRoutes = router;
