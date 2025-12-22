import crypto from "node:crypto";
import status from "http-status";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import type { IJwtPayload } from "../../interface";
import { use_object_id } from "../../utils/useObjectId";
import type IDrone from "../drone/drone.interface";
import Drone from "../drone/drone.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import Payment from "../payment/payment.model";
import type { ISSLCommerz } from "../payment/sslCommerz.interface";
import { SSLServices } from "../payment/sslCommerz.service";
import User from "../user/user.model";
import {
  isOrderStatusImmutable,
  OrderSearchableFields,
} from "./order.constant";
import type IOrder from "./order.interface";
import type { ICreateOrder, TOrderStatus } from "./order.interface";
import Order from "./order.model";

async function getOrdersFromDB(query: Record<string, unknown>) {
  const ordersQuery = new QueryBuilder(
    Order.find()
      .populate("user", "name")
      .populate("drones.id", "price name img"),
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
}

async function getUserOrdersFromDB({
  userId,
  query,
}: {
  userId: string;
  query: Record<string, unknown>;
}) {
  const ordersQuery = new QueryBuilder(
    Order.find({
      user: use_object_id(userId),
      // status: {
      //   $nin: [ORDER_STATUS.ADMIN_CANCELLED, ORDER_STATUS.USER_CANCELLED],
      // },
    })
      .populate("drones.id")
      .populate("reviews.drone", "name img")
      .populate("reviews.review"),
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
}

async function getOrderByIdFromDB(id: string) {
  return await Order.findById(id).populate("drones.id");
}

function totalDronePrice(
  drones: IDrone[],
  cart_drones: { _id: string; quantity: number }[],
) {
  let total_price = 0;

  drones.forEach((drone) => {
    const quantity =
      cart_drones.find((item) => String(item._id) === String(drone._id))
        ?.quantity || 0;
    total_price += drone.price * quantity;
  });

  return total_price;
}

async function createOrderIntoDB(payload: ICreateOrder, user: IJwtPayload) {
  const user_data = await User.findById(user.id);
  if (!user_data) throw new AppError(status.NOT_FOUND, "User not found!");

  const droneIds = payload.drones.map((item) => use_object_id(item._id));
  let foundDrones = await Drone.find(
    { _id: { $in: droneIds }, quantity: { $gte: 1 } },
    { price: 1, quantity: 1 },
  );

  const tmp = foundDrones;
  foundDrones = [];
  for (const drone of tmp) {
    const exist = payload.drones.find(
      (d) => d._id.toString() === drone._id.toString(),
    );
    if (exist) foundDrones.push(drone);
  }

  if (!foundDrones?.length)
    throw new AppError(status.NOT_FOUND, "Drone not found!");

  const total_price = totalDronePrice(foundDrones, payload.drones);

  const doc = {
    user: user_data._id,
    totalPrice: total_price,
    drones: payload.drones.map((drone) => ({
      quantity: drone.quantity,
      id: drone._id,
    })),
    shippingInformation: payload.shippingInformation,
  };

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const order_data = await Order.create([doc], { session });
    if (!order_data)
      throw new AppError(
        status.BAD_REQUEST,
        "Failed to create order data into db!",
      );

    // payment
    const transaction_id = crypto.randomUUID();
    const payment = await Payment.create(
      [
        {
          order: use_object_id(order_data[0]._id),
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
    console.log("failed to create order err -", err);
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(status.BAD_REQUEST, "Failed to create order!");
  }
}

async function updateOrderStatusIntoDB({
  payload: { status: orderStatus, cancelReason },
  id,
  user,
}: {
  payload: { status: TOrderStatus; cancelReason?: string };
  id: string;
  user: IJwtPayload;
}) {
  let orderExists: IOrder | null = null;
  if (user.role === "user")
    orderExists = await Order.findOne({
      _id: id,
      user: use_object_id(user.id),
    });
  else orderExists = await Order.findOne({ _id: id });

  if (!orderExists) throw new AppError(status.NOT_FOUND, "Order not found!");

  if (user.role !== "user" && isOrderStatusImmutable(orderExists.status))
    throw new AppError(
      status.BAD_REQUEST,
      "Cannot change status of completed or user-cancelled orders",
    );

  if (user.role === "user" && orderExists.status === "COMPLETED")
    throw new AppError(status.BAD_REQUEST, "Order is already completed!");

  const drones = await Drone.find({ _id: { $in: orderExists.drones } });

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

    if (drones?.length) {
      for (const drone of drones) {
        await Drone.updateOne(
          { _id: drone._id },
          { $inc: { quantity: +drone.quantity } },
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
}

export const OrderServices = {
  getOrdersFromDB,
  getUserOrdersFromDB,
  getOrderByIdFromDB,
  createOrderIntoDB,
  updateOrderStatusIntoDB,
};
