import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/sendImageToCloudinary";
import { USER_ROLE } from "../user/user.constant";
import { BrandControllers } from "./brand.controller";

const router = Router();

router.get("/", BrandControllers.get_brands);
router.get("/:id", BrandControllers.get_brand_by_id);
router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  upload.single("file"),
  (req: Request, _res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  BrandControllers.create_brand,
);
router.put(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  upload.single("file"),
  (req: Request, _res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  BrandControllers.update_brand,
);
router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  BrandControllers.delete_brand,
);

export const BrandRoutes = router;
