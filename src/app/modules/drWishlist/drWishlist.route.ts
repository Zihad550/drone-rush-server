import { Router } from "express";
import { WishlistController } from "./drWishlist.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/add", auth(), WishlistController.addToWishlist);
router.delete(
  "/remove/:productId",
  auth(),
  WishlistController.removeFromWishlist,
);
router.get("/", auth(), WishlistController.getWishlist);

export const WishlistRoutes = router;
