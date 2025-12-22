import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import { use_object_id } from "../../utils/useObjectId";
import Drone from "../drone/drone.model";
import Wishlist from "../wishlist/wishlist.model";
import Cart from "./cart.model";

async function addToCart(
  userId: string,
  droneId: string,
  quantity: number = 1,
) {
  // Check if drone exists
  const drone = await Drone.findById(droneId);
  if (!drone) {
    throw new AppError(httpStatus.NOT_FOUND, "Drone not found");
  }

  // Check if already in cart
  const existing = await Cart.findOne({
    user: use_object_id(userId),
    drone: use_object_id(droneId),
  });

  if (existing) {
    // Increment quantity
    // existing.quantity += quantity;
    // return existing.save();
    await removeFromCart(userId, droneId);
    return null;
  } else {
    // Create new
    return Cart.create({
      user: userId,
      drone: droneId,
      quantity,
    });
  }
}

async function updateCartQuantity(
  userId: string,
  droneId: string,
  newQuantity: number,
) {
  if (newQuantity < 1) {
    throw new AppError(httpStatus.BAD_REQUEST, "Quantity must be at least 1");
  }

  const result = await Cart.findOneAndUpdate(
    {
      user: use_object_id(userId),
      drone: use_object_id(droneId),
    },
    { quantity: newQuantity },
    { new: true },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Cart item not found");
  }
  return result;
}

async function removeFromCart(userId: string, droneId: string) {
  const result = await Cart.findOneAndDelete({
    user: use_object_id(userId),
    drone: use_object_id(droneId),
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Cart item not found");
  }
  return result;
}

const getUserCart = async (userId: string) => {
  const cart = await Cart.find({ user: use_object_id(userId) })
    .populate("drone")
    .sort({ createdAt: -1 });
  return cart;
};

async function addToCartAndRemoveFromWishlist(
  userId: string,
  droneId: string,
  quantity: number = 1,
) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if drone exists
    const drone = await Drone.findById(droneId).session(session);
    if (!drone) {
      throw new AppError(httpStatus.NOT_FOUND, "Drone not found");
    }

    // Add to cart (or update quantity if exists)
    const existingCart = await Cart.findOne({
      user: use_object_id(userId),
      drone: use_object_id(droneId),
    }).session(session);

    let cartItem: any;
    if (existingCart) {
      existingCart.quantity += quantity;
      cartItem = await existingCart.save({ session });
    } else {
      cartItem = await Cart.create(
        [
          {
            user: userId,
            drone: droneId,
            quantity,
          },
        ],
        { session },
      );
      cartItem = cartItem[0];
    }

    // Remove from wishlist (if exists)
    await Wishlist.findOneAndDelete({
      user: use_object_id(userId),
      drone: use_object_id(droneId),
    }).session(session);

    await session.commitTransaction();
    return cartItem;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

async function addToWishlistAndRemoveFromCart(userId: string, droneId: string) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if drone exists
    const drone = await Drone.findById(droneId).session(session);
    if (!drone) {
      throw new AppError(httpStatus.NOT_FOUND, "Drone not found");
    }

    // Check if already in wishlist
    const existingWishlist = await Wishlist.findOne({
      user: use_object_id(userId),
      drone: use_object_id(droneId),
    }).session(session);

    if (!existingWishlist) {
      // Add to wishlist if not exists
      await Wishlist.create(
        [
          {
            user: userId,
            drone: droneId,
          },
        ],
        { session },
      );
    }

    // Remove from cart
    const cartItem = await Cart.findOneAndDelete({
      user: use_object_id(userId),
      drone: use_object_id(droneId),
    }).session(session);

    if (!cartItem) {
      throw new AppError(httpStatus.NOT_FOUND, "Cart item not found");
    }

    await session.commitTransaction();
    return cartItem;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

export const CartService = {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  getUserCart,
  addToCartAndRemoveFromWishlist,
  addToWishlistAndRemoveFromCart,
};
