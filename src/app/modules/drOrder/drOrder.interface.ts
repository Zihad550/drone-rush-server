import { Types } from "mongoose";
import IUser from "../drUser/drUser.interface";
import IShippingInfo from "../drShippingInformation/drShippingInformation.interface";
import IProduct from "../drProduct/drProduct.interface";

export default interface IOrder {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUser;
  admin?: Types.ObjectId | IUser;
  shippingInformation: Types.ObjectId | IShippingInfo;
  product: Types.ObjectId | IProduct;
  status: TOrderStatus;
  cancelReason?: string;
}

export type TOrderStatus =
  | "pending"
  | "processing"
  | "packaged"
  | "delivering"
  | "user-cancelled"
  | "admin-cancelled"
  | "completed";
