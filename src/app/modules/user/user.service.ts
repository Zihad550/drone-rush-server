import status from "http-status";
import AppError from "../../errors/AppError";
import { USER_ROLE } from "./user.constant";
import User from "./user.model";

const updateUserToAdmin = async (email: string) => {
	const user = await User.findOneAndUpdate(
		{ email },
		{ role: USER_ROLE.ADMIN },
	);
	if (!user) throw new AppError(status.NOT_FOUND, "User not found!");
};

export const UserServices = {
	updateUserToAdmin,
};
