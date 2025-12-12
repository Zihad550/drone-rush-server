import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReviewServices } from "./review.service";

const createReview = catchAsync(async (req, res) => {
  const { user } = req;
  const data = await ReviewServices.createReviewIntoDB(req.body, user);
  sendResponse(res, {
    data,
    statusCode: status.CREATED,
    success: true,
    message: "Review created successfully",
  });
});

const updateReview = catchAsync(async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const data = await ReviewServices.updateReviewIntoDB(id, req.body, user);
  sendResponse(res, {
    data,
    statusCode: status.OK,
    success: true,
    message: "Review updated successfully",
  });
});

const deleteReview = catchAsync(async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const data = await ReviewServices.deleteReviewIntoDB(id, user);
  sendResponse(res, {
    data,
    statusCode: status.OK,
    success: true,
    message: "Review deleted successfully",
  });
});

const getReviews = catchAsync(async (req, res) => {
  const { data, meta } = await ReviewServices.getReviewsFromDB(req.query);
  sendResponse(res, {
    data,
    statusCode: status.OK,
    success: true,
    message: "Reviews retrieved successfully",
    meta,
  });
});

export const ReviewControllers = {
  createReview,
  updateReview,
  deleteReview,
  getReviews,
};
