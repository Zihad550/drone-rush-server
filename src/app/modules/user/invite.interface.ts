import type { Model, Types } from "mongoose";

export type TInviteStatus = "pending" | "accepted" | "expired";

export default interface IInvite {
  _id: Types.ObjectId;
  email: string;
  token: string;
  status: TInviteStatus;
  invitedBy: Types.ObjectId; // superAdmin ID
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInviteModelType extends Model<IInvite> {}
