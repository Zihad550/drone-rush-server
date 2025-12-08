import status from "http-status";
import jwt from "jsonwebtoken";
import env from "../../env";
import AppError from "../errors/AppError";
import type { IJwtPayload } from "../interface";
import type { TUserRole } from "../modules/drUser/drUser.interface";
import User from "../modules/drUser/drUser.model";
import catchAsync from "../utils/catchAsync";

const auth = (...requiredRoles: TUserRole[]) => {
	return catchAsync(async (req, _, next) => {
		const token = req.headers?.authorization || req.cookies.accessToken;

		// checking if the token is missing
		if (!token)
			throw new AppError(status.UNAUTHORIZED, "You are not authorized!");

		// checking if the given token is valid
		const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as IJwtPayload;

		const { role, id } = decoded;

		// checking if the user is exist
		const user = await User.findById(id);

		if (!user) throw new AppError(status.NOT_FOUND, "This user is not found !");

		// checking if the user is already deleted

		// checking if the user is blocked
		const userStatus = user?.status;

		if (userStatus === "blocked")
			throw new AppError(status.FORBIDDEN, "This user is blocked ! !");

		if (requiredRoles?.length && !requiredRoles.includes(role))
			throw new AppError(status.UNAUTHORIZED, "You are not authorized  hi!");

		req.user = decoded;
		next();
	});
};

export default auth;
