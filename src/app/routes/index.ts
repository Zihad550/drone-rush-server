import { Router } from "express";
import { AuthRoutes } from "../modules/drAuth/auth.route";
import { BrandRoutes } from "../modules/drBrand/drBrand.route";
import { CartRoutes } from "../modules/drCart/drCart.route";
import { CategoryRoutes } from "../modules/drCategory/drCategory.route";
import { OrderRoutes } from "../modules/drOrder/drOrder.route";
import { ProductRoutes } from "../modules/drProduct/drProduct.route";
import { ShippingInformationRoutes } from "../modules/drShippingInformation/drShippingInformation.route";
import { UserRoutes } from "../modules/drUser/drUser.route";
import { WishlistRoutes } from "../modules/drWishlist/drWishlist.route";
import { PaymentRoutes } from "../modules/payment/payment.route";

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
