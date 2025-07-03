import status from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import useObjectId from "../../utils/useObjectId";
import { ORDER_STATUS, OrderSearchableFields } from "./drOrder.constant";
import IOrder, { TOrderStatus } from "./drOrder.interface";
import Order from "./drOrder.model";
import Product from "../drProduct/drProduct.model";
import { IJwtPayload } from "../../interface";

const getOrdersFromDB = async (query: Record<string, unknown>) => {
  const ordersQuery = new QueryBuilder(
    Order.find().populate("user", "name").populate("product", "price name img"),
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

const createOrderIntoDB = async (payload: IOrder, userId: string) => {
  const foundProduct = await Product.findById(payload.product);
  if (!foundProduct) throw new AppError(status.NOT_FOUND, "Product not found!");
  const doc = {
    ...payload,
    user: userId,
  };
  const createdDoc = await Order.create(doc);
  await Product.findByIdAndUpdate(payload.product, {
    quantity: { $inc: -1 },
  });
  return createdDoc;
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
