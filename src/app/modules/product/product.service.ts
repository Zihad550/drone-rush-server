import status from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { useObjectId } from "../../utils/useObjectId";
import Cart from "../cart/cart.model";
import Wishlist from "../wishlist/wishlist.model";
import { ProductSearchableFields } from "./product.constant";
import type IProduct from "./product.interface";
import Product from "./product.model";

const getProductsFromDB = async (
	query: Record<string, unknown>,
	userId?: string,
) => {
	const productsQuery = new QueryBuilder(
		Product.find().populate("brand").populate("category"),
		query,
	)
		.search(ProductSearchableFields)
		.filter()
		.sort()
		.paginate()
		.fields();
	const data = await productsQuery.modelQuery;
	const meta = await productsQuery.countTotal();

	// Add wishlist status if user is authenticated
	if (userId) {
		const wishlistItems = await Wishlist.find({
			user: useObjectId(userId),
		}).select("product");
		const wishlistProductIds = wishlistItems.map((item) =>
			item.product.toString(),
		);

		data.forEach((product) => {
			product.isInWishlist = wishlistProductIds.includes(
				product._id.toString(),
			);
		});
	}

	return {
		data,
		meta,
	};
};

const getProductByIdFromDB = async (id: string, userId?: string) => {
	const product = await Product.findOne({ _id: id })
		.populate("brand")
		.populate("category");

	if (!product) throw new AppError(status.NOT_FOUND, "Product not found!");

	// Add wishlist status if user is authenticated
	if (userId && product) {
		const wishlistItem = await Wishlist.findOne({
			user: userId,
			product: id,
		});
		const cartItem = await Cart.findOne({
			user: userId,
			product: id,
		});
		product.isInWishlist = !!wishlistItem;
		product.isInCart = !!cartItem;
	}

	return product;
};

const createProductIntoDB = async (payload: IProduct) => {
	return await Product.create(payload);
};

const deleteProductByIdFromDB = async (id: string) => {
	const data = await Product.findOneAndDelete({ _id: id });
	if (!data) throw new AppError(status.NOT_FOUND, "Product not found!");
	return data;
};

export const ProductServices = {
	getProductsFromDB,
	getProductByIdFromDB,
	createProductIntoDB,
	deleteProductByIdFromDB,
};
