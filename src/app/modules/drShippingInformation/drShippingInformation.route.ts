import { Router } from "express";
import { ShippingInformationControllers } from "./drShippingInformation.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../drUser/drUser.constant";

const router = Router();

router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ShippingInformationControllers.getAllShippingInformation,
);
router.get(
  "/user",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER),
  ShippingInformationControllers.getUserShippingInformations,
);
router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER),
  ShippingInformationControllers.createShippingInformation,
);
router.patch(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER),
  ShippingInformationControllers.updateShippingInformation,
);
router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER),
  ShippingInformationControllers.deleteShippingInformation,
);

export const ShippingInformationRoutes = router;
