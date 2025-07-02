import { Router } from "express";
import { OrderControllers } from "./drOrder.controller";
import verifyToken from "../../middlewares/verifyToken";

const router = Router();

router.get("/user", verifyToken, OrderControllers.getUserOrders);
router.get("/:id", OrderControllers.getOrderById);
router.post("/", OrderControllers.createOrder);
router.patch("/:id", OrderControllers.updateOrder);

export const OrderRoutes = router;
