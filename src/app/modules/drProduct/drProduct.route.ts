import { Router } from "express";
import { ProductControllers } from "./drProduct.controller";
import { USER_ROLE } from "../drUser/drUser.constant";
import auth from "../../middlewares/auth";

const router = Router();

router.get("/", ProductControllers.getProducts);
router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ProductControllers.createProduct,
);
router.get("/:id", ProductControllers.getProductById);
router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ProductControllers.deleteProduct,
);

export const ProductRoutes = router;
