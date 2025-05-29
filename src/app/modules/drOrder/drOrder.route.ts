import { Router } from "express";
import { OrderControllers } from "./drOrder.controller";

const router = Router();

router.get("/user", OrderControllers.getUserOrders);
router.get("/:id", OrderControllers.getOrderById);
router.post("/", OrderControllers.createOrder);
router.patch("/:id", OrderControllers.updateOrder);

export const OrderRoutes = router;
