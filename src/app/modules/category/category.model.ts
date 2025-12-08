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
const Category = model<ICategory>(
	"drCategory",
	categorySchema,
	"dronerush_categories",
);
export default Category;
