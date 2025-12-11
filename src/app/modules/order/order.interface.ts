import type { Types } from "mongoose";
import type IDrone from "../drone/drone.interface";
import type { IPayment } from "../payment/payment.interface";
import type IShippingInfo from "../shippingInformation/shippingInformation.interface";
import type IUser from "../user/user.interface";

export default interface IOrder {
	_id: Types.ObjectId;
	user: Types.ObjectId | IUser;
	payment: Types.ObjectId | IPayment;
	shippingInformation: Types.ObjectId | IShippingInfo;
	drones: { id: Types.ObjectId | IDrone; quantity: number }[];
	status: TOrderStatus;
	cancelReason?: string;
	totalPrice: number;
	stripeSessionId?: string;
	stripePaymentIntentId?: string;
	stripeChargeId?: string;
}

export interface IOrderDrone {
	id: Types.ObjectId | IDrone;
	quantity: number;
}

export interface ICreateOrder extends Omit<IOrder, "_id" | "drones"> {
	drones: { _id: string; quantity: number }[];
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
