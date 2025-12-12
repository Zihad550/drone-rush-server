import type { Types } from "mongoose";
import type IDrone from "../drone/drone.interface";
import type IOrder from "../order/order.interface";
import type IUser from "../user/user.interface";

export default interface IReview {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUser;
  order: Types.ObjectId | IOrder;
  drone: Types.ObjectId | IDrone;
  comment: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}
