import type { TUserStatus } from "./drUser.interface";

export const USER_ROLE = {
	SUPER_ADMIN: "superAdmin",
	ADMIN: "admin",
	USER: "user",
} as const;

export const UserStatuses: TUserStatus[] = ["active", "blocked"];
