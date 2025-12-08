import { Router } from "express";
import auth from "../../middlewares/auth";
import { CartController } from "./cart.controller";

const router = Router();

router.post("/add", auth(), CartController.addToCart);
router.put("/update/:productId", auth(), CartController.updateCartQuantity);
router.delete("/remove/:productId", auth(), CartController.removeFromCart);
router.get("/", auth(), CartController.getCart);

export const CartRoutes = router;
