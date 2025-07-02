import status from "http-status";
import AppError from "../../errors/AppError";
import IUser from "../drUser/drUser.interface";
import User from "../drUser/drUser.model";
import { createToken } from "./auth.utils";
import config from "../../config";

const register = async (payload: IUser) => {
  const userExists = await User.findOne({ email: payload.email });
  if (userExists)
    throw new AppError(status.BAD_REQUEST, "User already registered");

  const userData: Partial<IUser> = {
    name: payload.name,
    email: payload.email,
    role: "user",
    status: "active",
    password: payload.password,
  };
  const newUser = await User.create(userData);
  if (!newUser) throw new AppError(status.BAD_REQUEST, "Failed to create user");

  const jwtPayload = {
    user: {
      id: String(newUser._id),
      role: newUser.role,
    },
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const login = async (payload: Pick<IUser, "email" | "password">) => {
  const userExists = await User.findOne({ email: payload.email });
  if (!userExists)
    throw new AppError(status.BAD_REQUEST, "Something went wrong!");

  const isPasswordMatch = await User.isPasswordMatched(
    payload.password,
    userExists.password,
  );
  if (!isPasswordMatch)
    throw new AppError(status.BAD_REQUEST, "Something went wrong!");

  const jwtPayload = {
    user: {
      id: String(userExists._id),
      role: userExists.role,
    },
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthServices = {
  register,
  login,
};
