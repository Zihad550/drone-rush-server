import status from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import type { IJwtPayload } from "../../interface";
import { use_object_id } from "../../utils/useObjectId";
import Order from "../order/order.model";
import { ReviewSearchableFields } from "./review.constant";
import Review from "./review.model";

const createReviewIntoDB = async (
  payload: {
    orderId: string;
    droneId: string;
    rating: number;
    comment: string;
  },
  user: IJwtPayload,
) => {
  // Check if order exists and belongs to user and is completed
  const order = await Order.findOne({
    _id: use_object_id(payload.orderId),
    user: use_object_id(user.id),
    status: "COMPLETED",
  });

  if (!order) {
    throw new AppError(status.NOT_FOUND, "Order not found or not completed");
  }

  // Check if drone is in the order
  const droneInOrder = order.drones.find(
    (d) => d.id.toString() === payload.droneId,
  );

  if (!droneInOrder) {
    throw new AppError(status.BAD_REQUEST, "Drone not in this order");
  }

  // Check if review already exists
  const existingReview = await Review.findOne({
    user: use_object_id(user.id),
    order: use_object_id(payload.orderId),
    drone: use_object_id(payload.droneId),
  });

  if (existingReview) {
    throw new AppError(
      status.BAD_REQUEST,
      "Review already exists for this drone",
    );
  }

  const review = await Review.create({
    user: use_object_id(user.id),
    order: use_object_id(payload.orderId),
    drone: use_object_id(payload.droneId),
    rating: payload.rating,
    comment: payload.comment,
  });

  // Update order to include the review
  await Order.findByIdAndUpdate(payload.orderId, {
    $push: {
      reviews: { drone: use_object_id(payload.droneId), review: review._id },
    },
  });

  return review;
};

const updateReviewIntoDB = async (
  reviewId: string,
  payload: { rating: number; comment: string },
  user: IJwtPayload,
) => {
  const review = await Review.findOneAndUpdate(
    { _id: use_object_id(reviewId), user: use_object_id(user.id) },
    payload,
    { new: true },
  );

  if (!review) {
    throw new AppError(status.NOT_FOUND, "Review not found");
  }

  return review;
};

const deleteReviewIntoDB = async (reviewId: string, user: IJwtPayload) => {
  const review = await Review.findOneAndDelete({
    _id: use_object_id(reviewId),
    user: use_object_id(user.id),
  });

  if (!review) {
    throw new AppError(status.NOT_FOUND, "Review not found");
  }

  // Update order to remove the review
  await Order.findByIdAndUpdate(review.order, {
    $pull: { reviews: { review: review._id } },
  });

  return review;
};

const getReviewsFromDB = async (query: Record<string, unknown>) => {
  const reviewsQuery = new QueryBuilder(
    Review.find().populate("user", "name").populate("drone", "name img"),
    query,
  )
    .search(ReviewSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const data = await reviewsQuery.modelQuery;
  const meta = await reviewsQuery.countTotal();
  return { data, meta };
};

export const ReviewServices = {
  createReviewIntoDB,
  updateReviewIntoDB,
  deleteReviewIntoDB,
  getReviewsFromDB,
};
