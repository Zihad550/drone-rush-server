import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { useObjectId } from "../../utils/useObjectId";
import Product from "../drProduct/drProduct.model";
import Wishlist from "./drWishlist.model";

const addToWishlist = async (userId: string, productId: string) => {
  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Check if already exists
  const existing = await Wishlist.findOne({
    user: useObjectId(userId),
    product: useObjectId(productId),
  });
  if (existing) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product already in wishlist");
  }

  const wishlistItem = await Wishlist.create({
    user: userId,
    product: productId,
  });
  return wishlistItem;
};

const removeFromWishlist = async (userId: string, productId: string) => {
  const result = await Wishlist.findOneAndDelete({
    user: useObjectId(userId),
    product: useObjectId(productId),
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Wishlist item not found");
  }
  return result;
};

const getUserWishlist = async (userId: string) => {
  const wishlist = await Wishlist.find({ user: useObjectId(userId) })
    .populate("product")
    .sort({ createdAt: -1 });
  return wishlist;
};

export const WishlistService = {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
};
