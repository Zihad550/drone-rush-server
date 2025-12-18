import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AnalyticsServices } from "./analytics.service";

const get_analytics = catchAsync(async (req, res) => {
  const { user } = req;
  const data = await AnalyticsServices.get_user_analytics(user.id);

  sendResponse(res, {
    data,
    statusCode: status.OK,
    success: true,
    message: "Analytics retrieved successfully",
  });
});

const get_admin_analytics = catchAsync(async (_req, res) => {
  const data = await AnalyticsServices.get_admin_analytics();

  sendResponse(res, {
    data,
    statusCode: status.OK,
    success: true,
    message: "Admin analytics retrieved successfully",
  });
});

export const AnalyticsControllers = {
  get_analytics,
  get_admin_analytics,
};
