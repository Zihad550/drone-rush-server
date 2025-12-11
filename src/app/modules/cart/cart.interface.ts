import type { Types } from "mongoose";
import type IDrone from "../drone/drone.interface";
import type IUser from "../user/user.interface";

export default interface ICart {
	_id: Types.ObjectId;
	user: Types.ObjectId | IUser;
	drone: Types.ObjectId | IDrone;
	quantity: number;
	createdAt: Date;
	updatedAt: Date;
}
