import { Types } from "mongoose";
import IUser from "../drUser/drUser.interface";

export default interface IShippingInfo {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUser;
  street: string;
  apt?: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  createdAt: Date;
  updatedAt: Date;
  paymentMethod: TPaymentMethod;
}

export type TPaymentMethod = "COD" | "CARD";
