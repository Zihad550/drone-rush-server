import status from "http-status";
import mongoose, { Types } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { IJwtPayload } from "../../interface";
import useObjectId from "../../utils/useObjectId";
import Product from "../drProduct/drProduct.model";
import { OrderSearchableFields } from "./drOrder.constant";
import { ICreateOrder, TOrderStatus } from "./drOrder.interface";
import Order from "./drOrder.model";

const getOrdersFromDB = async (query: Record<string, unknown>) => {
  const ordersQuery = new QueryBuilder(
    Order.find()
      .populate("user", "name")
      .populate("products", "price name img"),
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
    Order.find({ user: useObjectId(userId) }).populate("product"),
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
  return await Order.findById(id).populate("product");
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
    products: foundProducts.map((product) => product._id),
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
  console.log(user);
  const data = await Order.findByIdAndUpdate(
    id,
    { status: orderStatus, admin: user.id, cancelReason },
    { new: true },
  );
  if (!data) throw new AppError(status.NOT_FOUND, "Order not found!");
  return data;
};

export const OrderServices = {
  getOrdersFromDB,
  getUserOrdersFromDB,
  getOrderByIdFromDB,
  createOrderIntoDB,
  updateOrderStatusIntoDB,
};
