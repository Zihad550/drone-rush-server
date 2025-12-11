import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { useObjectId } from "../../utils/useObjectId";
import Drone from "../drone/drone.model";
import Wishlist from "./wishlist.model";

const addToWishlist = async (userId: string, droneId: string) => {
	// Check if drone exists
	const drone = await Drone.findById(droneId);
	if (!drone) {
		throw new AppError(httpStatus.NOT_FOUND, "Drone not found");
	}

	// Check if already exists
	const existing = await Wishlist.findOne({
		user: useObjectId(userId),
		drone: useObjectId(droneId),
	});
	if (existing) {
		throw new AppError(httpStatus.BAD_REQUEST, "Drone already in wishlist");
	}

	const wishlistItem = await Wishlist.create({
		user: userId,
		drone: droneId,
	});
	return wishlistItem;
};

const removeFromWishlist = async (userId: string, droneId: string) => {
	const result = await Wishlist.findOneAndDelete({
		user: useObjectId(userId),
		drone: useObjectId(droneId),
	});
	if (!result) {
		throw new AppError(httpStatus.NOT_FOUND, "Wishlist item not found");
	}
	return result;
};

const getUserWishlist = async (userId: string) => {
	const wishlist = await Wishlist.find({ user: useObjectId(userId) })
		.populate("drone")
		.sort({ createdAt: -1 });
	return wishlist;
};

export const WishlistService = {
	addToWishlist,
	removeFromWishlist,
	getUserWishlist,
};
