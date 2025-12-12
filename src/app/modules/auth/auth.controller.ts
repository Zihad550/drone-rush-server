import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { AuthServices } from "./auth.service";

const register = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await AuthServices.register(req.body);

  setAuthCookie(res, { accessToken, refreshToken });
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

  setAuthCookie(res, { accessToken, refreshToken });

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
  setAuthCookie(res, { accessToken: data.accessToken });

  sendResponse(res, {
    data,
    statusCode: status.OK,
    success: true,
  });
});

const logout = catchAsync(async (_req, res) => {
  res.clearCookie("refreshToken", {
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });
  res.clearCookie("accessToken", {
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });
  sendResponse(res, {
    data: null,
    statusCode: status.OK,
    success: true,
    message: "Logged out successfully",
  });
});

export const AuthControllers = {
  register,
  login,
  refreshToken,
  logout,
};
