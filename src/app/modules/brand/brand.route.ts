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

router.get("/", BrandControllers.getBrands);
router.get("/:id", BrandControllers.getBrandById);
router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  upload.single("file"),
  (req: Request, _res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  BrandControllers.createBrand,
);
router.put(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  upload.single("file"),
  (req: Request, _res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  BrandControllers.updateBrand,
);
router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  BrandControllers.deleteBrand,
);

export const BrandRoutes = router;
