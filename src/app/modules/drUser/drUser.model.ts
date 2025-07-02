import { model, Schema } from "mongoose";
import IUser, { IUserModelType } from "./drUser.interface";
import argon2 from "argon2";
import { USER_ROLE, UserStatuses } from "./drUser.constant";

// const userNameSchema = new Schema<IUserName>({
//   firstName: {
//     type: String,
//     required: true,
//   },
//   middleName: {
//     type: String,
//   },
//   lastName: {
//     type: String,
//     required: true,
//   },
// });

const userSchema = new Schema<IUser, IUserModelType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: USER_ROLE,
      default: "user",
    },
    status: {
      type: String,
      enum: UserStatuses,
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  this.password = await argon2.hash(this.password);
  next();
});

userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await argon2.verify(hashedPassword, plainTextPassword);
};

const User = model<IUser, IUserModelType>(
  "drUser",
  userSchema,
  "dronerush_users",
);
export default User;
