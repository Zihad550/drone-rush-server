import { Router } from "express";
import { OrderControllers } from "./drOrder.controller";
import verifyToken from "../../middlewares/verifyToken";

const router = Router();

router.get("/", verifyToken, OrderControllers.getOrders);
router.get("/user", verifyToken, OrderControllers.getUserOrders);
router.get("/:id", OrderControllers.getOrderById);
router.post("/", OrderControllers.createOrder);
router.patch("/status/:id", verifyToken, OrderControllers.updateOrderStatus);

export const OrderRoutes = router;
