import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../drUser/drUser.constant";
import { OrderControllers } from "./drOrder.controller";

const router = Router();

router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  OrderControllers.getOrders,
);
router.get(
  "/user",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER),
  OrderControllers.getUserOrders,
);
router.get(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER),
  OrderControllers.getOrderById,
);
router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER),
  OrderControllers.createOrder,
);
router.patch(
  "/status/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  OrderControllers.updateOrderStatus,
);

export const OrderRoutes = router;
