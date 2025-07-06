import status from "http-status";
import mongoose, { Types } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { IJwtPayload } from "../../interface";
import useObjectId from "../../utils/useObjectId";
import Product from "../drProduct/drProduct.model";
import { ORDER_STATUS, OrderSearchableFields } from "./drOrder.constant";
import { ICreateOrder, TOrderStatus } from "./drOrder.interface";
import Order from "./drOrder.model";

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

  console.log("model query ->", ordersQuery.modelQuery.getFilter());
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

const createOrderIntoDB = async (payload: ICreateOrder, user: IJwtPayload) => {
  const productIds = payload.products.map((item) => item._id);
  let foundProducts = await Product.find(
    { _id: { $in: productIds }, quantity: { $gte: 1 } },
    { price: 1, quantity: 1 },
  );
  payload.products.forEach((buyItem) => {
    foundProducts = foundProducts.filter(
      (product) => product.quantity >= buyItem.quantity,
    );
  });
  if (!foundProducts?.length)
    throw new AppError(status.NOT_FOUND, "Product not found!");

  const totalPrice = foundProducts.reduce(
    (acc, product) => acc + product.price,
    0,
  );

  const doc = {
    ...payload,
    user: new Types.ObjectId(user.id),
    totalPrice,
    products: foundProducts.map((product) => ({ ...product, id: product._id })),
  };
  console.log(doc);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const createdDoc = await Order.create([doc], { session });

    for (const product of foundProducts) {
      const count =
        payload.products.find(
          (item) => String(item._id) === String(product._id),
        )?.quantity || 0;
      await Product.findOneAndUpdate(
        { _id: product._id },
        {
          $inc: { quantity: -count },
        },
        { session },
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return createdDoc[0];
  } catch (err) {
    console.log(err);
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
  let orderExists;
  if (user.role === "user")
    orderExists = await Order.findOne({ _id: id, user: useObjectId(user.id) });
  else orderExists = await Order.findOne({ _id: id });

  if (!orderExists) throw new AppError(status.NOT_FOUND, "Order not found!");

  const products = await Product.find({ _id: { $in: orderExists.products } });

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    let data;
    if (user.role === "user")
      data = await Order.updateOne(
        { _id: id },
        { status: orderStatus, cancelReason },
        { new: true, session },
      );
    else
      data = await Order.updateOne(
        { _id: id },
        { status: orderStatus, admin: user.id, cancelReason },
        { new: true, session },
      );
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

    return data;
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
