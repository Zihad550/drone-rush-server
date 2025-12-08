import { model, Schema } from "mongoose";
import type IReview from "./review.interface";

const reviewSchema = new Schema<IReview>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "drUser",
			required: true,
		},
		comment: {
			type: String,
			required: true,
		},
		rating: {
			type: Number,
			required: true,
			min: 0,
			max: 5,
		},
	},
	{
		timestamps: true,
	},
);

const Review = model<IReview>("drReview", reviewSchema, "dronerush_reviews");

export default Review;
