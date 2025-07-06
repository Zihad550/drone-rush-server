import status from "http-status";
import env from "../../../env";
import AppError from "../../errors/AppError";
import IUser from "../drUser/drUser.interface";
import User from "../drUser/drUser.model";
import { createToken } from "./auth.utils";

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
    id: String(newUser._id),
    role: newUser.role,
  };

  const accessToken = createToken(
    jwtPayload,
    env.JWT_ACCESS_SECRET,
    env.JWT_ACCESS_EXPIRES_IN,
  );
  const refreshToken = createToken(
    jwtPayload,
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRES_IN,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const login = async (payload: Pick<IUser, "email" | "password">) => {
  const userExists = await User.findOne({ email: payload.email });
  console.log(userExists);
  if (!userExists)
    throw new AppError(status.BAD_REQUEST, "Something went wrong!");

  const isPasswordMatch = await User.isPasswordMatched(
    payload.password,
    userExists.password,
  );
  if (!isPasswordMatch)
    throw new AppError(status.BAD_REQUEST, "Something went wrong!");

  const jwtPayload = {
    id: String(userExists._id),
    role: userExists.role,
  };

  const accessToken = createToken(
    jwtPayload,
    env.JWT_ACCESS_SECRET,
    env.JWT_ACCESS_EXPIRES_IN,
  );
  const refreshToken = createToken(
    jwtPayload,
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRES_IN,
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
