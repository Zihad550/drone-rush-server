import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../drUser/drUser.constant";
import { ProductControllers } from "./drProduct.controller";

const router = Router();

router.get("/", auth(), ProductControllers.getProducts);
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
