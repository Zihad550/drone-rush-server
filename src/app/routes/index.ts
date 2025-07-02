import { Router } from "express";
import { ProductRoutes } from "../modules/drProduct/drProduct.route";
import { OrderRoutes } from "../modules/drOrder/drOrder.route";
import { AuthRoutes } from "../modules/drAuth/auth.route";
import { CategoryRoutes } from "../modules/drCategory/drCategory.route";

const router = Router();
const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/products",
    route: ProductRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
  {
    path: "/categories",
    route: CategoryRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
