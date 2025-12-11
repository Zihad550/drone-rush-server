import { model, Schema } from "mongoose";
import type ICategory from "./category.interface";

const categorySchema = new Schema<ICategory>(
	{
		name: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);
const Category = model<ICategory>("Category", categorySchema);
export default Category;
