import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../drUser/drUser.constant";
import { PaymentController } from "./payment.controller";

const router = express.Router();

// Payment callbacks (Public - called by SSLCommerz)
router.post("/success", PaymentController.successPayment);
router.post("/fail", PaymentController.failPayment);
router.post("/cancel", PaymentController.cancelPayment);

// IPN validation (Public - called by SSLCommerz)
router.post("/validate-payment", PaymentController.validatePayment);

// Invoice download (Authenticated users)
router.get(
  "/invoice/:paymentId",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  PaymentController.getInvoiceDownloadUrl,
);

export const PaymentRoutes = router;
