import status from "http-status";
import env from "../../../env";
import AppError from "../../errors/AppError";
import { sendEmail } from "../../utils/sendEmail";
import { createToken } from "../auth/auth.utils";
import Invite from "./invite.model";
import { USER_ROLE } from "./user.constant";
import User from "./user.model";

const updateUserToAdmin = async (email: string) => {
  const user = await User.findOneAndUpdate(
    { email },
    { role: USER_ROLE.ADMIN },
  );
  if (!user) throw new AppError(status.NOT_FOUND, "User not found!");
};

const createInvite = async (email: string, invitedBy: string) => {
  // Check if invite already exists and is pending
  const existingInvite = await Invite.findOne({ email, status: "pending" });
  if (existingInvite) {
    throw new AppError(status.BAD_REQUEST, "Invite already sent to this email");
  }

  // Generate token
  const token = createToken(
    { email, invitedBy },
    env.JWT_ACCESS_CONTROL,
    "7d", // 7 days
  );

  // Create invite record
  const invite = await Invite.create({
    email,
    token,
    invitedBy,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  // Send email
  const inviteUrl = `${env.FRONTEND_URL}/register?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Admin Invitation - Drone Rush",
    templateName: "adminInvite",
    templateData: {
      inviteUrl,
      email,
    },
  });

  return invite;
};

const getInvitesBySuperAdmin = async (superAdminId: string) => {
  return Invite.find({ invitedBy: superAdminId }).sort({ createdAt: -1 });
};

const deleteInvite = async (inviteId: string, superAdminId: string) => {
  const invite = await Invite.findOneAndDelete({
    _id: inviteId,
    invitedBy: superAdminId,
  });
  if (!invite) throw new AppError(status.NOT_FOUND, "Invite not found");
  return invite;
};

const verifyInviteToken = async (token: string) => {
  const { verifyToken } = await import("../auth/auth.utils");
  try {
    const decoded = verifyToken(token, env.JWT_ACCESS_CONTROL);
    const invite = await Invite.findOne({
      email: decoded.email,
      token,
      status: "pending",
      expiresAt: { $gt: new Date() },
    });
    if (!invite)
      throw new AppError(status.BAD_REQUEST, "Invalid or expired invite");
    return { email: decoded.email, inviteId: invite._id };
  } catch (_error) {
    throw new AppError(status.BAD_REQUEST, "Invalid token");
  }
};

const acceptInvite = async (inviteId: string) => {
  await Invite.findByIdAndUpdate(inviteId, { status: "accepted" });
};

export const UserServices = {
  updateUserToAdmin,
  createInvite,
  getInvitesBySuperAdmin,
  deleteInvite,
  verifyInviteToken,
  acceptInvite,
};
