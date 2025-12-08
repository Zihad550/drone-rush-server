import type { Types } from "mongoose";
import type { IPayment } from "../payment/payment.interface";
import type IProduct from "../product/product.interface";
import type IShippingInfo from "../shippingInformation/shippingInformation.interface";
import type IUser from "../user/user.interface";

export default interface IOrder {
	_id: Types.ObjectId;
	user: Types.ObjectId | IUser;
	payment: Types.ObjectId | IPayment;
	shippingInformation: Types.ObjectId | IShippingInfo;
	products: { id: Types.ObjectId | IProduct; quantity: number }[];
	status: TOrderStatus;
	cancelReason?: string;
	totalPrice: number;
	stripeSessionId?: string;
	stripePaymentIntentId?: string;
	stripeChargeId?: string;
}

export interface IOrderProduct {
	id: Types.ObjectId | IProduct;
	quantity: number;
}

export interface ICreateOrder extends Omit<IOrder, "_id" | "products"> {
	products: { _id: string; quantity: number }[];
}

export type TOrderStatus =
	| "PENDING"
	| "PROCESSING"
	| "PACKAGED"
	| "DELIVERING"
	| "USER-CANCELLED"
	| "FAILED"
	| "COMPLETED";
// | "ADMIN-CANCELLED"
