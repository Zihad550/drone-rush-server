import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const sendInvite = catchAsync(async (req, res) => {
  const { email } = req.body;
  const invitedBy = req.user.id; // from auth middleware

  const invite = await UserServices.createInvite(email, invitedBy);

  sendResponse(res, {
    data: invite,
    statusCode: status.CREATED,
    success: true,
    message: "Invite sent successfully",
  });
});

const getInvites = catchAsync(async (req, res) => {
  const superAdminId = req.user.id;
  const invites = await UserServices.getInvitesBySuperAdmin(superAdminId);

  sendResponse(res, {
    data: invites,
    statusCode: status.OK,
    success: true,
    message: "Invites retrieved successfully",
  });
});

const deleteInviteById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const superAdminId = req.user.id;

  await UserServices.deleteInvite(id, superAdminId);

  sendResponse(res, {
    data: null,
    statusCode: status.OK,
    success: true,
    message: "Invite deleted successfully",
  });
});

export const InviteControllers = {
  sendInvite,
  getInvites,
  deleteInviteById,
};
