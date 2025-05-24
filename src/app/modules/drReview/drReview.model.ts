import { model, Schema } from "mongoose";
import IReview from "./dronerushReview.interface";

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
    },
  },
  {
    timestamps: true,
  },
);

const Review = model<IReview>("drReview", reviewSchema, "dronerush_reviews");

export default Review;
