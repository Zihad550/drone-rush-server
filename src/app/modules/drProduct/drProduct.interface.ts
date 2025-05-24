import { Types } from "mongoose";
import IReview from "../drReview/dronerushReview.interface";
import ICategory from "../drCategory/drCategory.interface";
import IBrand from "../drBrand/drBrand.interface";
export default interface IProduct {
  _id: Types.ObjectId;
  img: string;
  name: string;
  description: string;
  price: number;
  category: Types.ObjectId | ICategory;
  reviews: Types.ObjectId[] | IReview[];
  brand: Types.ObjectId | IBrand;
  quantity?: number;
  createdAt: Date;
  updatedAt: Date;
}
