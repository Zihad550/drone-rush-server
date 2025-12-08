import type { Types } from "mongoose";
import type IProduct from "../drProduct/drProduct.interface";
import type IUser from "../drUser/drUser.interface";

export default interface ICart {
	_id: Types.ObjectId;
	user: Types.ObjectId | IUser;
	product: Types.ObjectId | IProduct;
	quantity: number;
	addedAt: Date;
}
