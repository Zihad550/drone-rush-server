import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { ReviewControllers } from "./review.controller";

const router = Router();

router.get("/", ReviewControllers.getReviews);

router.post(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ReviewControllers.createReview,
);

router.patch(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ReviewControllers.updateReview,
);

router.delete(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ReviewControllers.deleteReview,
);

export const ReviewRoutes = router;
