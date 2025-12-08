import type { Types } from "mongoose";
import type IProduct from "../drProduct/drProduct.interface";
import type IShippingInfo from "../drShippingInformation/drShippingInformation.interface";
import type IUser from "../drUser/drUser.interface";
import { IPayment } from "../payment/payment.interface";

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
