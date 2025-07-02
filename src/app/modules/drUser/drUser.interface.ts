import { Model, Types } from "mongoose";
import { USER_ROLE } from "./drUser.constant";

export default interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  role: TUserRole;
  status: TUserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export type TUserStatus = "active" | "blocked";

// export interface IUserName {
//   firstName: string;
//   middleName: string;
//   lastName: string;
// }

export interface IUserModelType extends Model<IUser> {
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
