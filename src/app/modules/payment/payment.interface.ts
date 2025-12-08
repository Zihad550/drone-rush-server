import type { Types } from "mongoose";
import IUser from "../drUser/drUser.interface";
import IOrder from "../drOrder/drOrder.interface";

export enum PAYMENT_STATUS {
  PENDING = "PENDING",
  PAID = "PAID",
  UNPAID = "UNPAID",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface IPayment {
  order: Types.ObjectId | IOrder;
  user: Types.ObjectId | IUser;
  transactionId: string;
  amount: number;
  paymentGatewayData?: unknown;
  invoiceUrl?: string;
  status: PAYMENT_STATUS;
  heldAt?: Date;
  releasedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISSLCommerz {
  amount: number;
  transactionId: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
}
