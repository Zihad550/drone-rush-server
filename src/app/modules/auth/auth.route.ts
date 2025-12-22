import { Router } from "express";
import auth from "../../middlewares/auth";
import validate_request from "../../middlewares/validate-request";
import { USER_ROLE } from "../user/user.constant";
import { AuthControllers } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = Router();

router.post("/register", AuthControllers.register);
router.post("/login", AuthControllers.login);
router.post("/refresh-token", AuthControllers.refresh_token);
router.post("/logout", AuthControllers.logout);

router.patch(
  "/reset-password",
  auth(...Object.values(USER_ROLE)),
  validate_request(AuthValidation.resetPasswordZodSchema),
  AuthControllers.reset_password,
);

router.post(
  "/forgot-password",
  validate_request(AuthValidation.forgotPasswordZodSchema),
  AuthControllers.forgot_password,
);

export const AuthRoutes = router;
