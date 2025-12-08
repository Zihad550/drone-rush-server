import argon2 from "argon2";
import { model, Schema } from "mongoose";
import { USER_ROLE, UserStatuses } from "./user.constant";
import type IUser from "./user.interface";
import type { IUserModelType } from "./user.interface";

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
		stripeCustomerId: {
			type: String,
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

userSchema.post("save", (doc, next) => {
	doc.password = "";
	next();
});

userSchema.statics.isPasswordMatched = async (
	plainTextPassword: string,
	hashedPassword: string,
) => await argon2.verify(hashedPassword, plainTextPassword);

const User = model<IUser, IUserModelType>(
	"drUser",
	userSchema,
	"dronerush_users",
);
export default User;
