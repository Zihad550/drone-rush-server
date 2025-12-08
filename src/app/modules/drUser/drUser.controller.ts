import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./drUser.service";

const updateUserToAdmin = catchAsync(async (req, res) => {
	const data = await UserServices.updateUserToAdmin(req.body.email);

	sendResponse(res, {
		data,
		statusCode: status.OK,
		success: true,
		message: "User updated successfully",
	});
});

export const UserControllers = {
	updateUserToAdmin,
};
