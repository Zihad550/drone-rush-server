import { model, Schema } from "mongoose";
import type IWishlist from "./wishlist.interface";

const wishlistSchema = new Schema<IWishlist>(
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
  },
  {
    timestamps: true,
  },
);

// Compound unique index to prevent duplicate user-drone pairs
wishlistSchema.index({ user: 1, drone: 1 }, { unique: true });

const Wishlist = model<IWishlist>("Wishlist", wishlistSchema);

export default Wishlist;
