import { Types } from "mongoose";

export default interface IBrand {
  _id: Types.ObjectId;
  name: string;
  logo: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
