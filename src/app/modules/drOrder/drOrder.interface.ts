import { Types } from "mongoose";
import IUser from "../drUser/drUser.interface";
import IShippingInfo from "../drShippingInformation/drShippingInformation.interface";
import IProduct from "../drProduct/drProduct.interface";

export default interface IOrder {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUser;
  shippingInformation: Types.ObjectId | IShippingInfo;
  product: Types.ObjectId | IProduct;
  status: TOrderStatus;
}

export type TOrderStatus =
  | "processing"
  | "packaged"
  | "delivered"
  | "buyer-cancelled"
  | "seller-cancelled"
  | "completed";
