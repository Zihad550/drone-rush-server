import type { Types } from "mongoose";
import type IDrone from "../drone/drone.interface";
import type IUser from "../user/user.interface";

export default interface IWishlist {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUser;
  drone: Types.ObjectId | IDrone;
  createdAt: Date;
  updatedAt: Date;
}
