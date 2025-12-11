import type { Model, Types } from "mongoose";
import type { USER_ROLE } from "./user.constant";

export default interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  address?: string;
  phone?: string;
  password: string;
  passwordChangedAt?: Date;
  role: TUserRole;
  status: TUserStatus;
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TUserStatus = "active" | "blocked";
export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

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
