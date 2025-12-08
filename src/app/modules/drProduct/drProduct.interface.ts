import type { Types } from "mongoose";
import type IBrand from "../drBrand/drBrand.interface";
import type ICategory from "../drCategory/drCategory.interface";
import type IReview from "../drReview/drReview.interface";
export default interface IProduct {
	_id: Types.ObjectId;
	img: string;
	name: string;
	description: string;
	price: number;
	category: Types.ObjectId | ICategory;
	reviews: Types.ObjectId[] | IReview[];
	brand: Types.ObjectId | IBrand;
	quantity: number;
	isInWishlist?: boolean;
	isInCart?: boolean;
	createdAt: Date;
	updatedAt: Date;
}
