import { Router } from "express";
import auth from "../../middlewares/auth";
import { WishlistController } from "./drWishlist.controller";

const router = Router();

router.post("/add", auth(), WishlistController.addToWishlist);
router.delete(
	"/remove/:productId",
	auth(),
	WishlistController.removeFromWishlist,
);
router.get("/", auth(), WishlistController.getWishlist);

export const WishlistRoutes = router;
