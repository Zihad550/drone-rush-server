import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { CartController } from "./cart.controller";

const router = Router();

router.post("/add", auth(USER_ROLE.USER), CartController.addToCart);
router.post(
  "/add-and-remove-from-wishlist",
  auth(USER_ROLE.USER),
  CartController.addToCartAndRemoveFromWishlist,
);
router.post(
  "/move-to-wishlist",
  auth(USER_ROLE.USER),
  CartController.addToWishlistAndRemoveFromCart,
);
router.put(
  "/update/:droneId",
  auth(USER_ROLE.USER),
  CartController.updateCartQuantity,
);
router.delete(
  "/remove/:droneId",
  auth(USER_ROLE.USER),
  CartController.removeFromCart,
);
router.get("/", auth(USER_ROLE.USER), CartController.getCart);

export const CartRoutes = router;
