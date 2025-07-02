import status from "http-status";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const register = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await AuthServices.register(req.body);

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
  });
  sendResponse(res, {
    data: {
      accessToken,
    },
    statusCode: status.OK,
    success: true,
  });
});

const login = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await AuthServices.login(req.body);

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
  });

  sendResponse(res, {
    data: {
      accessToken,
    },
    statusCode: status.OK,
    success: true,
  });
});

export const AuthControllers = {
  register,
  login,
};
