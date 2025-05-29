import { model, Schema } from "mongoose";
import IUser, { IUserName } from "./drUser.interface";

const userNameSchema = new Schema<IUserName>({
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const userSchema = new Schema<IUser>(
  {
    name: {
      type: userNameSchema,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = model<IUser>("drUser", userSchema, "dronerush_users");
export default User;
