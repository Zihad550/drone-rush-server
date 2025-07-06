import { Types } from "mongoose";
import IProduct from "../drProduct/drProduct.interface";
import IShippingInfo from "../drShippingInformation/drShippingInformation.interface";
import IUser from "../drUser/drUser.interface";

export default interface IOrder {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUser;
  admin?: Types.ObjectId | IUser;
  shippingInformation: Types.ObjectId | IShippingInfo;
  products: Types.ObjectId | IProduct[];
  status: TOrderStatus;
  cancelReason?: string;
  totalPrice: number;
}

export interface IOrderProduct {
  id: Types.ObjectId | IProduct;
  quantity: number;
}

export interface ICreateOrder extends Omit<IOrder, "_id" | "products"> {
  products: { _id: string; quantity: number }[];
}

export type TOrderStatus =
  | "pending"
  | "processing"
  | "packaged"
  | "delivering"
  | "user-cancelled"
  | "admin-cancelled"
  | "completed";
