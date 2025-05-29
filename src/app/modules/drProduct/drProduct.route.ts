import { Router } from "express";
import { ProductControllers } from "./drProduct.controller";

const router = Router();

router.get("/", ProductControllers.getProducts);
router.post("/", ProductControllers.createProduct);
router.get("/:id", ProductControllers.getProductById);
router.delete("/:id", ProductControllers.deleteProduct);

export const ProductRoutes = router;
