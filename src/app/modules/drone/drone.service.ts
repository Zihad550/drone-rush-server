import status from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { useObjectId } from "../../utils/useObjectId";
import Cart from "../cart/cart.model";
import Wishlist from "../wishlist/wishlist.model";
import { DroneSearchableFields } from "./drone.constant";
import type IDrone from "./drone.interface";
import Drone from "./drone.model";

const getDronesFromDB = async (
	query: Record<string, unknown>,
	userId?: string,
) => {
	const dronesQuery = new QueryBuilder(
		Drone.find().populate("brand").populate("category"),
		query,
	)
		.search(DroneSearchableFields)
		.filter()
		.sort()
		.paginate()
		.fields();
	const data = await dronesQuery.modelQuery;
	const meta = await dronesQuery.countTotal();

	// Add wishlist status if user is authenticated
	if (userId) {
		const wishlistItems = await Wishlist.find({
			user: useObjectId(userId),
		}).select("drone");
		const wishlistDroneIds = wishlistItems.map((item) => item.drone.toString());

		data.forEach((drone) => {
			drone.isInWishlist = wishlistDroneIds.includes(drone._id.toString());
		});
	}

	return {
		data,
		meta,
	};
};

const getDroneByIdFromDB = async (id: string, userId?: string) => {
	const drone = await Drone.findOne({ _id: id })
		.populate("brand")
		.populate("category");

	if (!drone) throw new AppError(status.NOT_FOUND, "Drone not found!");

	// Add wishlist status if user is authenticated
	if (userId && drone) {
		const wishlistItem = await Wishlist.findOne({
			user: userId,
			drone: id,
		});
		const cartItem = await Cart.findOne({
			user: userId,
			drone: id,
		});
		drone.isInWishlist = !!wishlistItem;
		drone.isInCart = !!cartItem;
	}

	return drone;
};

const createDroneIntoDB = async (payload: IDrone) => {
	return await Drone.create(payload);
};

const deleteDroneByIdFromDB = async (id: string) => {
	const data = await Drone.findOneAndDelete({ _id: id });
	if (!data) throw new AppError(status.NOT_FOUND, "Drone not found!");
	return data;
};

export const DroneServices = {
	getDronesFromDB,
	getDroneByIdFromDB,
	createDroneIntoDB,
	deleteDroneByIdFromDB,
};
