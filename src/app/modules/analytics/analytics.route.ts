import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { AnalyticsControllers } from "./analytics.controller";

const router = Router();

router.get("/", auth(USER_ROLE.USER), AnalyticsControllers.getAnalytics);
router.get(
  "/admin",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  AnalyticsControllers.getAdminAnalytics,
);

export const AnalyticsRoutes = router;
