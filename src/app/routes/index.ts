import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { BrandRoutes } from "../modules/brand/brand.route";
import { CartRoutes } from "../modules/cart/cart.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { OrderRoutes } from "../modules/order/order.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { ProductRoutes } from "../modules/product/product.route";
import { ShippingInformationRoutes } from "../modules/shippingInformation/shippingInformation.route";
import { UserRoutes } from "../modules/user/user.route";
import { WishlistRoutes } from "../modules/wishlist/wishlist.route";

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
	{
		path: "/brands",
		route: BrandRoutes,
	},
	{
		path: "/user",
		route: UserRoutes,
	},
	{
		path: "/shipping-information",
		route: ShippingInformationRoutes,
	},
	{
		path: "/wishlist",
		route: WishlistRoutes,
	},
	{
		path: "/cart",
		route: CartRoutes,
	},
	{
		path: "/payment",
		route: PaymentRoutes,
	},
];

moduleRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

export default router;
