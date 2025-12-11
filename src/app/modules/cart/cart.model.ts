import { model, Schema } from "mongoose";
import type ICart from "./cart.interface";

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    drone: {
      type: Schema.Types.ObjectId,
      ref: "Drone",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  },
);

// Compound unique index to prevent duplicate user-drone pairs
// cartSchema.index({ user: 1, drone: 1 }, { unique: true });

const Cart = model<ICart>("Cart", cartSchema);

export default Cart;
