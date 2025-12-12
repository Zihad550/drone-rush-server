import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { WishlistController } from "./wishlist.controller";

const router = Router();

router.post("/add", auth(USER_ROLE.USER), WishlistController.addToWishlist);
router.delete(
  "/remove/:droneId",
  auth(USER_ROLE.USER),
  WishlistController.removeFromWishlist,
);
router.get("/", auth(USER_ROLE.USER), WishlistController.getWishlist);

export const WishListRoutes = router;
