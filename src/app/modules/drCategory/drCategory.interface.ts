import { Types } from "mongoose";

export default interface ICategory {
  _id: Types.ObjectId;
  name: String;
  createdAt: String;
  updatedAt: String;
}
