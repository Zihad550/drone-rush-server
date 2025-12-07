import { Types } from "mongoose";
import IUser from "../drUser/drUser.interface";
import IProduct from "../drProduct/drProduct.interface";

export default interface IWishlist {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUser;
  product: Types.ObjectId | IProduct;
  addedAt: Date;
}
