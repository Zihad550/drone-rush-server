import type { Types } from "mongoose";
import type IBrand from "../brand/brand.interface";
import type ICategory from "../category/category.interface";
import type IReview from "../review/review.interface";
export default interface IDrone {
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
