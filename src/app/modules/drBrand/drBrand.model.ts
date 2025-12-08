import { model, Schema } from "mongoose";
import type IBrand from "./drBrand.interface";

const brandSchema = new Schema<IBrand>(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		logo: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const Brand = model<IBrand>("drBrand", brandSchema, "dronerush_brands");

export default Brand;
