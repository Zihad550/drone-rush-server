import type { Types } from "mongoose";
import type IUser from "../user/user.interface";

export default interface IReview {
	_id: Types.ObjectId;
	user: Types.ObjectId | IUser;
	comment: string;
	rating: number;
	createdAt: Date;
	updatedAt: Date;
}
