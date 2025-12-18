import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post("/register", AuthControllers.register);
router.post("/login", AuthControllers.login);
router.post("/refresh-token", AuthControllers.refresh_token);
router.post("/logout", AuthControllers.logout);

export const AuthRoutes = router;
