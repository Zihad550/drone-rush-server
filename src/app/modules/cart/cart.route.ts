import { Router } from "express";
import auth from "../../middlewares/auth";
import { CartController } from "./cart.controller";

const router = Router();

router.post("/add", auth(), CartController.addToCart);
router.post(
  "/add-and-remove-from-wishlist",
  auth(),
  CartController.addToCartAndRemoveFromWishlist,
);
router.post(
  "/move-to-wishlist",
  auth(),
  CartController.addToWishlistAndRemoveFromCart,
);
router.put("/update/:droneId", auth(), CartController.updateCartQuantity);
router.delete("/remove/:droneId", auth(), CartController.removeFromCart);
router.get("/", auth(), CartController.getCart);

export const CartRoutes = router;
