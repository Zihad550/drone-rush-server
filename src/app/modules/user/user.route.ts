import { Router } from "express";
import auth from "../../middlewares/auth";
import { InviteControllers } from "./invite.controller";
import { USER_ROLE } from "./user.constant";

const router = Router();

// Invite routes
router.post(
  "/invites/send",
  auth(USER_ROLE.SUPER_ADMIN),
  InviteControllers.sendInvite,
);

router.get(
  "/invites",
  auth(USER_ROLE.SUPER_ADMIN),
  InviteControllers.getInvites,
);

router.delete(
  "/invites/:id",
  auth(USER_ROLE.SUPER_ADMIN),
  InviteControllers.deleteInviteById,
);

export const UserRoutes = router;
