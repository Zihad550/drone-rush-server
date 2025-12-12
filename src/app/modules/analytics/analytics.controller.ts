import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AnalyticsServices } from "./analytics.service";

const getAnalytics = catchAsync(async (req, res) => {
  const { user } = req;
  const data = await AnalyticsServices.getUserAnalytics(user.id);

  sendResponse(res, {
    data,
    statusCode: status.OK,
    success: true,
    message: "Analytics retrieved successfully",
  });
});

export const AnalyticsControllers = {
  getAnalytics,
};
