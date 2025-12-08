import crypto from "crypto";
import status from "http-status";
import mongoose, { Types } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import type { IJwtPayload } from "../../interface";
import { useObjectId } from "../../utils/useObjectId";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import Payment from "../payment/payment.model";
import type { ISSLCommerz } from "../payment/sslCommerz.interface";
import { SSLServices } from "../payment/sslCommerz.service";
import type IProduct from "../product/product.interface";
import Product from "../product/product.model";
import User from "../user/user.model";
import { ORDER_STATUS, OrderSearchableFields } from "./order.constant";
import type IOrder from "./order.interface";
import type { ICreateOrder, TOrderStatus } from "./order.interface";
import Order from "./order.model";

const getOrdersFromDB = async (query: Record<string, unknown>) => {
	const ordersQuery = new QueryBuilder(
		Order.find()
			.populate("user", "name")
			.populate("products.id", "price name img"),
		query,
	)
		.search(OrderSearchableFields)
		.filter()
		.sort()
		.paginate()
		.fields();

	const data = await ordersQuery.modelQuery;
	const meta = await ordersQuery.countTotal();
	return {
		data,
		meta,
	};
};

const getUserOrdersFromDB = async ({
	userId,
	query,
}: {
	userId: string;
	query: Record<string, unknown>;
}) => {
	const ordersQuery = new QueryBuilder(
		Order.find({
			user: useObjectId(userId),
			status: {
				$nin: [ORDER_STATUS.ADMIN_CANCELLED, ORDER_STATUS.USER_CANCELLED],
			},
		}).populate("products.id"),
		query,
	)
		.search(OrderSearchableFields)
		.filter()
		.sort()
		.paginate()
		.fields();

	const data = await ordersQuery.modelQuery;
	const meta = await ordersQuery.countTotal();
	return {
		data,
		meta,
	};
};

const getOrderByIdFromDB = async (id: string) => {
	return await Order.findById(id).populate("products.id");
};

const totalProductPrice = (
	products: IProduct[],
	cart_products: { _id: string; quantity: number }[],
) => {
	let total_price = 0;

	products.forEach((product) => {
		const quantity =
			cart_products.find((item) => String(item._id) === String(product._id))
				?.quantity || 0;
		total_price += product.price * quantity;
	});

	return total_price;
};

const createOrderIntoDB = async (payload: ICreateOrder, user: IJwtPayload) => {
	const user_data = await User.findById(user.id);
	if (!user_data) throw new AppError(status.NOT_FOUND, "User not found!");

	const productIds = payload.products.map((item) => useObjectId(item._id));
	let foundProducts = await Product.find(
		{ _id: { $in: productIds }, quantity: { $gte: 1 } },
		{ price: 1, quantity: 1 },
	);

	const tmp = foundProducts;
	foundProducts = [];
	for (const product of tmp) {
		const exist = payload.products.find(
			(p) => p._id.toString() === product._id.toString(),
		);
		if (exist) foundProducts.push(product);
	}

	if (!foundProducts?.length)
		throw new AppError(status.NOT_FOUND, "Product not found!");

	const total_price = totalProductPrice(foundProducts, payload.products);

	const doc = {
		user: user_data._id,
		totalPrice: total_price,
		products: payload.products.map((product) => ({
			quantity: product.quantity,
			id: product._id,
		})),
	};

	const session = await mongoose.startSession();
	try {
		session.startTransaction();
		const order_data = await Order.create([doc], { session });
		if (!order_data)
			throw new AppError(status.BAD_REQUEST, "Failed to create order!");

		// payment
		const transaction_id = crypto.randomUUID();
		const payment = await Payment.create(
			[
				{
					order: useObjectId(order_data[0]._id),
					user: user_data._id,
					transactionId: transaction_id,
					status: PAYMENT_STATUS.PENDING,
					amount: total_price,
				},
			],
			{ session },
		);
		if (!payment)
			throw new AppError(status.NOT_FOUND, "failed to create payment");

		await Order.findByIdAndUpdate(
			order_data[0]._id,
			{
				payment: payment[0]._id,
			},
			{ session },
		);

		const sslPayload: ISSLCommerz = {
			address: user_data?.address || "",
			email: user_data?.email || "",
			phoneNumber: user_data?.phone || "",
			name: user.name || "",
			amount: total_price,
			transactionId: transaction_id,
		};

		const sslPayment = await SSLServices.sslPaymentInit(sslPayload);

		await session.commitTransaction();
		await session.endSession();

		return { paymentUrl: sslPayment.GatewayPageURL };
	} catch (err) {
		console.log("err -", err);
		await session.abortTransaction();
		await session.endSession();
		throw new AppError(status.BAD_REQUEST, "Failed to create order!");
	}
};

const updateOrderStatusIntoDB = async ({
	payload: { status: orderStatus, cancelReason },
	id,
	user,
}: {
	payload: { status: TOrderStatus; cancelReason?: string };
	id: string;
	user: IJwtPayload;
}) => {
	let orderExists: IOrder | null = null;
	if (user.role === "user")
		orderExists = await Order.findOne({ _id: id, user: useObjectId(user.id) });
	else orderExists = await Order.findOne({ _id: id });

	if (!orderExists) throw new AppError(status.NOT_FOUND, "Order not found!");

	if (user.role === "user" && orderExists.status === "COMPLETED")
		throw new AppError(status.BAD_REQUEST, "Order is already completed!");

	const products = await Product.find({ _id: { $in: orderExists.products } });

	const session = await mongoose.startSession();
	try {
		session.startTransaction();

		let updated_order_data: IOrder | null = null;
		if (user.role === "user")
			updated_order_data = await Order.findOneAndUpdate(
				{ _id: id },
				{ status: orderStatus, cancelReason },
				{ session },
			);
		else
			updated_order_data = await Order.findOneAndUpdate(
				{ _id: id },
				{ status: orderStatus, admin: user.id, cancelReason },
				{ session },
			);

		if (!updated_order_data)
			throw new AppError(status.NOT_FOUND, "Order not found!");

		if (products?.length) {
			for (const product of products) {
				await Product.updateOne(
					{ _id: product._id },
					{ $inc: { quantity: +product.quantity } },
					{ session },
				);
			}
		}

		await session.commitTransaction();
		await session.endSession();

		return updated_order_data;
	} catch {
		await session.abortTransaction();
		await session.endSession();
		throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to update order!");
	}
};

export const OrderServices = {
	getOrdersFromDB,
	getUserOrdersFromDB,
	getOrderByIdFromDB,
	createOrderIntoDB,
	updateOrderStatusIntoDB,
};
