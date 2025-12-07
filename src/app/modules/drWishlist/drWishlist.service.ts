import { Types } from "mongoose";
import Wishlist from "./drWishlist.model";
import Product from "../drProduct/drProduct.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const addToWishlist = async (
  userId: Types.ObjectId,
  productId: Types.ObjectId,
) => {
  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Check if already exists
  const existing = await Wishlist.findOne({ user: userId, product: productId });
  if (existing) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product already in wishlist");
  }

  const wishlistItem = await Wishlist.create({
    user: userId,
    product: productId,
  });
  return wishlistItem;
};

const removeFromWishlist = async (
  userId: Types.ObjectId,
  productId: Types.ObjectId,
) => {
  const result = await Wishlist.findOneAndDelete({
    user: userId,
    product: productId,
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Wishlist item not found");
  }
  return result;
};

const getUserWishlist = async (userId: Types.ObjectId) => {
  const wishlist = await Wishlist.find({ user: userId })
    .populate("product")
    .sort({ addedAt: -1 });
  return wishlist;
};

export const WishlistService = {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
};
