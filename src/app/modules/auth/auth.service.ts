import status from "http-status";
import env from "../../../env";
import AppError from "../../errors/AppError";
import type IUser from "../user/user.interface";
import User from "../user/user.model";
import { UserServices } from "../user/user.service";
import { create_token, verify_token } from "./auth.utils";

const register = async (payload: IUser & { inviteToken?: string }) => {
  const user_exists = await User.findOne({ email: payload.email });
  if (user_exists)
    throw new AppError(status.BAD_REQUEST, "User already registered");

  let role: "user" | "admin" = "user";
  let invite_id: string | undefined;

  if (payload?.inviteToken) {
    const invite_data = await UserServices.verifyInviteToken(
      payload.inviteToken,
    );
    role = "admin";
    invite_id = invite_data.inviteId.toString();
  }

  const user_data: Partial<IUser> = {
    name: payload.name,
    email: payload.email,
    role,
    status: "active",
    password: payload.password,
  };
  const new_user = await User.create(user_data);
  if (!new_user)
    throw new AppError(status.BAD_REQUEST, "Failed to create user");

  // Mark invite as accepted if it was used
  if (invite_id) {
    await UserServices.acceptInvite(invite_id);
  }

  const jwt_payload = {
    id: String(new_user._id),
    role: new_user.role,
  };

  const access_token = create_token(
    jwt_payload,
    env.JWT_ACCESS_SECRET,
    env.JWT_ACCESS_EXPIRES_IN,
  );
  const refresh_token = create_token(
    jwt_payload,
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRES_IN,
  );

  return {
    accessToken: access_token,
    refreshToken: refresh_token,
  };
};

const login = async (payload: Pick<IUser, "email" | "password">) => {
  const user_exists = await User.findOne({ email: payload.email });
  if (!user_exists)
    throw new AppError(status.BAD_REQUEST, "Something went wrong!");

  const is_password_match = await User.isPasswordMatched(
    payload.password,
    user_exists.password,
  );
  if (!is_password_match)
    throw new AppError(status.BAD_REQUEST, "Something went wrong!");

  const jwt_payload = {
    id: String(user_exists._id),
    role: user_exists.role,
  };

  const access_token = create_token(
    jwt_payload,
    env.JWT_ACCESS_SECRET,
    env.JWT_ACCESS_EXPIRES_IN,
  );
  const refresh_token = create_token(
    jwt_payload,
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRES_IN,
  );

  return {
    accessToken: access_token,
    refreshToken: refresh_token,
  };
};

const refresh_token = async (token: string) => {
  const { id } = verify_token(token, env.JWT_REFRESH_SECRET);

  const user = await User.findById(id);
  if (!user) throw new AppError(status.NOT_FOUND, "User not found");
  if (user.status === "blocked")
    throw new AppError(status.FORBIDDEN, "User is blocked");

  const jwt_payload = {
    id: String(user._id),
    role: user.role,
  };

  const access_token = create_token(
    jwt_payload,
    env.JWT_ACCESS_SECRET,
    env.JWT_ACCESS_EXPIRES_IN,
  );

  return {
    accessToken: access_token,
  };
};

export const AuthServices = {
  register,
  login,
  refresh_token,
};
