import { NextFunction, Request, Response, Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { DroneControllers } from "./drone.controller";
import { upload } from "../../utils/sendImageToCloudinary";

const router = Router();

router.get("/", DroneControllers.getDrones);
router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = JSON.parse(req.body.data);
    } catch (error) {
      return next(error);
    }
    next();
  },
  DroneControllers.createDrone,
);
router.get("/:id", DroneControllers.getDroneById);
router.patch(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = JSON.parse(req.body.data);
    } catch (error) {
      return next(error);
    }
    next();
  },
  DroneControllers.updateDrone,
);
router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  DroneControllers.deleteDrone,
);

export const DroneRoutes = router;
