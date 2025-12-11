import type { Types } from "mongoose";

export default interface ICategory {
  _id: Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
