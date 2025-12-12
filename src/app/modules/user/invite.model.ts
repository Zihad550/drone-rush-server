import { model, Schema } from "mongoose";

import type IInvite, { IInviteModelType, TInviteStatus } from "./invite.interface";

const inviteSchema = new Schema<IInvite, IInviteModelType>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "expired"] as TInviteStatus[],
      default: "pending",
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Invite = model<IInvite, IInviteModelType>("Invite", inviteSchema);
export default Invite;