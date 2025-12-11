import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { DroneControllers } from "./drone.controller";

const router = Router();

router.get("/", DroneControllers.getDrones);
router.post(
	"/",
	auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
	DroneControllers.createDrone,
);
router.get("/:id", DroneControllers.getDroneById);
router.delete(
	"/:id",
	auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
	DroneControllers.deleteDrone,
);

export const DroneRoutes = router;
