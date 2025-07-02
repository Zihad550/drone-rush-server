import status from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import useObjectId from "../../utils/useObjectId";
import { OrderSearchableFields } from "./drOrder.constant";
import IOrder, { TOrderStatus } from "./drOrder.interface";
import Order from "./drOrder.model";
import Product from "../drProduct/drProduct.model";

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

const updateOrderIntoDB = async ({
  orderStatus,
  id,
}: {
  orderStatus: TOrderStatus;
  id: string;
}) => {
  const data = await Order.findByIdAndUpdate(
    id,
    { status: orderStatus },
    { new: true },
  );
  if (!data) throw new AppError(status.NOT_FOUND, "Order not found!");
  return data;
};

export const OrderServices = {
  getUserOrdersFromDB,
  getOrderByIdFromDB,
  createOrderIntoDB,
  updateOrderIntoDB,
};
