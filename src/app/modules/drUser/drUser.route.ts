import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./drUser.constant";
import { UserControllers } from "./drUser.controller";

const router = Router();

router.post(
	"/update-to-admin",
	auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
	UserControllers.updateUserToAdmin,
);

export const UserRoutes = router;
