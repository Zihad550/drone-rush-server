import type { Request, Response } from "express";
import httpStatus from "http-status";
import { Types } from "mongoose";
import { z } from "zod";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CartService } from "./drCart.service";

const addCartValidation = z.object({
	body: z.object({
		productId: z.string().refine((val) => Types.ObjectId.isValid(val), {
			message: "Invalid product ID",
		}),
		quantity: z.number().min(1).optional().default(1),
	}),
});

const updateCartValidation = z.object({
	params: z.object({
		productId: z.string().refine((val) => Types.ObjectId.isValid(val), {
			message: "Invalid product ID",
		}),
	}),
	body: z.object({
		quantity: z.number().min(1),
	}),
});

const removeCartValidation = z.object({
	params: z.object({
		productId: z.string().refine((val) => Types.ObjectId.isValid(val), {
			message: "Invalid product ID",
		}),
	}),
});

const addToCart = catchAsync(async (req: Request, res: Response) => {
	const validatedData = addCartValidation.parse(req);
	const { productId, quantity } = validatedData.body;
	const userId = req?.user?.id;

	const result = await CartService.addToCart(userId, productId, quantity);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Product added to cart successfully",
		data: result,
	});
});

const updateCartQuantity = catchAsync(async (req: Request, res: Response) => {
	const validatedData = updateCartValidation.parse(req);
	const { productId } = validatedData.params;
	const { quantity } = validatedData.body;
	const userId = req.user.id;

	const result = await CartService.updateCartQuantity(
		userId,
		productId,
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
	const { productId } = validatedData.params;
	const userId = req.user.id;

	const result = await CartService.removeFromCart(userId, productId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Product removed from cart successfully",
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

export const CartController = {
	addToCart,
	updateCartQuantity,
	removeFromCart,
	getCart,
};
