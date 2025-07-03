import { Router } from "express";
import { UserControllers } from "./drUser.controller";

const router = Router();

router.post("/update-to-admin", UserControllers.updateUserToAdmin);

export const UserRoutes = router;
