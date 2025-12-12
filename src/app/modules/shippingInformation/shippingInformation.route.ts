import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { ShippingInformationControllers } from "./shippingInformation.controller";

const router = Router();

router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ShippingInformationControllers.getAllShippingInformation,
);
router.get(
  "/user",
  auth(USER_ROLE.USER),
  ShippingInformationControllers.getUserShippingInformations,
);
router.post(
  "/",
  auth(USER_ROLE.USER),
  ShippingInformationControllers.createShippingInformation,
);
router.get(
  "/:id",
  auth(USER_ROLE.USER),
  ShippingInformationControllers.getShippingInformationById,
);
router.patch(
  "/:id",
  auth(USER_ROLE.USER),
  ShippingInformationControllers.updateShippingInformation,
);
router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER),
  ShippingInformationControllers.deleteShippingInformation,
);

export const ShippingInformationRoutes = router;
