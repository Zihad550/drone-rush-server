import { Schema, model } from "mongoose";
import IWishlist from "./drWishlist.interface";

const wishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "addedAt", updatedAt: false },
  },
);

// Compound unique index to prevent duplicate user-product pairs
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

const Wishlist = model<IWishlist>("Wishlist", wishlistSchema);

export default Wishlist;
