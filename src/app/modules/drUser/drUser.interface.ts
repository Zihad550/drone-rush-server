import { Types } from "mongoose";

export default interface IUser {
  _id: Types.ObjectId;
  name: IUserName;
  email: string;
  password: string;
  role: string;
  accessToken: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserName {
  firstName: string;
  middleName: string;
  lastName: string;
}
