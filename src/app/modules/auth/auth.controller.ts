import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { set_auth_cookie } from "../../utils/setCookie";
import { AuthServices } from "./auth.service";

const register = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await AuthServices.register(req.body);

  set_auth_cookie(res, { accessToken, refreshToken });
  sendResponse(res, {
    data: {
      accessToken,
    },
    statusCode: status.OK,
    success: true,
  });
});

const login = catchAsync(async (req, res) => {
  console.log("req boy -", req.body);
  const { accessToken, refreshToken } = await AuthServices.login(req.body);

  set_auth_cookie(res, { accessToken, refreshToken });

  sendResponse(res, {
    data: {
      accessToken,
    },
    statusCode: status.OK,
    success: true,
  });
});

const refresh_token = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const data = await AuthServices.refresh_token(refreshToken);
  set_auth_cookie(res, { accessToken: data.accessToken });

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

const forgot_password = catchAsync(async (req, res) => {
  const { email } = req.body;

  await AuthServices.forgot_password(email);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Email Sent Successfully",
    data: null,
  });
});

const reset_password = catchAsync(async (req, res) => {
  const decodedToken = req.user;

  await AuthServices.reset_password(decodedToken, req.body);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Password Changed Successfully",
    data: null,
  });
});

export const AuthControllers = {
  register,
  login,
  refresh_token,
  logout,
  forgot_password,
  reset_password,
};
