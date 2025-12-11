import type { TUserStatus } from "./user.interface";

export const USER_ROLE = {
  SUPER_ADMIN: "superAdmin",
  ADMIN: "admin",
  USER: "user",
} as const;

export const UserStatuses: TUserStatus[] = ["active", "blocked"];
