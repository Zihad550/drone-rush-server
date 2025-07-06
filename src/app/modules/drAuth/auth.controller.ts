import status from "http-status";
import env from "../../../env";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const register = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await AuthServices.register(req.body);

  res.cookie("refreshToken", refreshToken, {
    secure: env.NODE_ENV === "production",
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
    secure: env.NODE_ENV === "production",
  });

  sendResponse(res, {
    data: {
      accessToken,
    },
    statusCode: status.OK,
    success: true,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const data = await AuthServices.refreshToken(refreshToken);
  sendResponse(res, {
    data,
    statusCode: status.OK,
    success: true,
  });
});

export const AuthControllers = {
  register,
  login,
  refreshToken,
};
