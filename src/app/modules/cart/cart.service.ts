import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { useObjectId } from "../../utils/useObjectId";
import Product from "../product/product.model";
import Cart from "./cart.model";

const addToCart = async (
	userId: string,
	productId: string,
	quantity: number = 1,
) => {
	// Check if product exists
	const product = await Product.findById(productId);
	if (!product) {
		throw new AppError(httpStatus.NOT_FOUND, "Product not found");
	}

	// Check if already in cart
	const existing = await Cart.findOne({
		user: useObjectId(userId),
		product: useObjectId(productId),
	});

	if (existing) {
		// Increment quantity
		existing.quantity += quantity;
		await existing.save();
		return existing;
	} else {
		// Create new
		const cartItem = await Cart.create({
			user: userId,
			product: productId,
			quantity,
		});
		return cartItem;
	}
};

const updateCartQuantity = async (
	userId: string,
	productId: string,
	newQuantity: number,
) => {
	if (newQuantity < 1) {
		throw new AppError(httpStatus.BAD_REQUEST, "Quantity must be at least 1");
	}

	const result = await Cart.findOneAndUpdate(
		{
			user: useObjectId(userId),
			product: useObjectId(productId),
		},
		{ quantity: newQuantity },
		{ new: true },
	);

	if (!result) {
		throw new AppError(httpStatus.NOT_FOUND, "Cart item not found");
	}
	return result;
};

const removeFromCart = async (userId: string, productId: string) => {
	const result = await Cart.findOneAndDelete({
		user: useObjectId(userId),
		product: useObjectId(productId),
	});
	if (!result) {
		throw new AppError(httpStatus.NOT_FOUND, "Cart item not found");
	}
	return result;
};

const getUserCart = async (userId: string) => {
	const cart = await Cart.find({ user: useObjectId(userId) })
		.populate("product")
		.sort({ createdAt: -1 });
	return cart;
};

export const CartService = {
	addToCart,
	updateCartQuantity,
	removeFromCart,
	getUserCart,
};
