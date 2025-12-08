import type { Types } from "mongoose";
import type IProduct from "../product/product.interface";
import type IUser from "../user/user.interface";

export default interface ICart {
	_id: Types.ObjectId;
	user: Types.ObjectId | IUser;
	product: Types.ObjectId | IProduct;
	quantity: number;
	addedAt: Date;
}
