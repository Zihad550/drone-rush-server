import { Router } from "express";
import { ShippingInformationControllers } from "./drShippingInformation.controller";
import verifyToken from "../../middlewares/verifyToken";

const router = Router();

router.get("/", ShippingInformationControllers.getAllShippingInformation);
router.get(
  "/user",
  verifyToken,
  ShippingInformationControllers.getShippingInformationByUserId,
);
router.post("/", ShippingInformationControllers.createShippingInformation);
router.patch("/:id", ShippingInformationControllers.updateShippingInformation);
router.delete("/:id", ShippingInformationControllers.deleteShippingInformation);

export const ShippingInformationRoutes = router;
