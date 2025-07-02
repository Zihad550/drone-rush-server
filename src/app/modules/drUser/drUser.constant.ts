import { TUserStatus } from "./drUser.interface";

export const USER_ROLE = {
  superAdmin: "superAdmin",
  admin: "admin",
  user: "user",
} as const;

export const UserStatuses: TUserStatus[] = ["active", "blocked"];
