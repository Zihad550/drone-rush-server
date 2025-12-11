import type { Request, Response } from "express";
import httpStatus from "http-status";
import { Types } from "mongoose";
import { z } from "zod";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CartService } from "./cart.service";

const addCartValidation = z.object({
  body: z.object({
    droneId: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid drone ID",
    }),
    quantity: z.number().min(1).optional().default(1),
  }),
});

const updateCartValidation = z.object({
  params: z.object({
    droneId: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid drone ID",
    }),
  }),
  body: z.object({
    quantity: z.number().min(1),
  }),
});

const removeCartValidation = z.object({
  params: z.object({
    droneId: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid drone ID",
    }),
  }),
});

const addToCart = catchAsync(async (req: Request, res: Response) => {
  const validatedData = addCartValidation.parse(req);
  const { droneId, quantity } = validatedData.body;
  console.log("drone id -", droneId);
  const userId = req.user.id;
  console.log("user id -", userId);

  const result = await CartService.addToCart(userId, droneId, quantity);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Drone added to cart successfully",
    data: result,
  });
});

const updateCartQuantity = catchAsync(async (req: Request, res: Response) => {
  const validatedData = updateCartValidation.parse(req);
  const { droneId } = validatedData.params;
  const { quantity } = validatedData.body;
  const userId = req.user.id;

  const result = await CartService.updateCartQuantity(
    userId,
    droneId,
    quantity,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cart quantity updated successfully",
    data: result,
  });
});

const removeFromCart = catchAsync(async (req: Request, res: Response) => {
  const validatedData = removeCartValidation.parse(req);
  const { droneId } = validatedData.params;
  const userId = req.user.id;

  const result = await CartService.removeFromCart(userId, droneId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Drone removed from cart successfully",
    data: result,
  });
});

const getCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const result = await CartService.getUserCart(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cart retrieved successfully",
    data: result,
  });
});

const addToCartAndRemoveFromWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const validatedData = addCartValidation.parse(req);
    const { droneId, quantity } = validatedData.body;
    const userId = req.user.id;

    const result = await CartService.addToCartAndRemoveFromWishlist(
      userId,
      droneId,
      quantity,
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Drone added to cart and removed from wishlist successfully",
      data: result,
    });
  },
);

const addToWishlistAndRemoveFromCart = catchAsync(
  async (req: Request, res: Response) => {
    const validatedData = addCartValidation.parse(req);
    const { droneId } = validatedData.body;
    const userId = req.user.id;

    const result = await CartService.addToWishlistAndRemoveFromCart(
      userId,
      droneId,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Drone moved to wishlist successfully",
      data: result,
    });
  },
);

export const CartController = {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  getCart,
  addToCartAndRemoveFromWishlist,
  addToWishlistAndRemoveFromCart,
};
