import { Router } from "express";
import { ProductRoutes } from "../modules/drProduct/drProduct.route";
import { OrderRoutes } from "../modules/drOrder/drOrder.route";

const router = Router();
const moduleRoutes = [
  {
    path: "/products",
    route: ProductRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
