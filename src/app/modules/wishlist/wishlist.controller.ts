import type { Request, Response } from "express";
import httpStatus from "http-status";
import { Types } from "mongoose";
import { z } from "zod";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { WishlistService } from "./wishlist.service";

const addWishlistValidation = z.object({
	body: z.object({
		productId: z.string().refine((val) => Types.ObjectId.isValid(val), {
			message: "Invalid product ID",
		}),
	}),
});

const removeWishlistValidation = z.object({
	params: z.object({
		productId: z.string().refine((val) => Types.ObjectId.isValid(val), {
			message: "Invalid product ID",
		}),
	}),
});

const addToWishlist = catchAsync(async (req: Request, res: Response) => {
	const validatedData = addWishlistValidation.parse(req);
	const { productId } = validatedData.body;
	const userId = req?.user?.id;

	const result = await WishlistService.addToWishlist(userId, productId);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Product added to wishlist successfully",
		data: result,
	});
});

const removeFromWishlist = catchAsync(async (req: Request, res: Response) => {
	const validatedData = removeWishlistValidation.parse(req);
	const { productId } = validatedData.params;
	const userId = req.user.id;

	const result = await WishlistService.removeFromWishlist(userId, productId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Product removed from wishlist successfully",
		data: result,
	});
});

const getWishlist = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user.id;

	const result = await WishlistService.getUserWishlist(userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Wishlist retrieved successfully",
		data: result,
	});
});

export const WishlistController = {
	addToWishlist,
	removeFromWishlist,
	getWishlist,
};
