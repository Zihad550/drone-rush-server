import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderServices } from "./drOrder.service";

const getOrders = catchAsync(async (req, res) => {
  console.log("query ->", req.query);
  const { data, meta } = await OrderServices.getOrdersFromDB(req.query);
  sendResponse(res, {
    data,
    statusCode: status.OK,
    success: true,
    message: "Orders retrieved successfully",
    meta,
  });
});

const getUserOrders = catchAsync(async (req, res) => {
  const { user } = req;
  const { data, meta } = await OrderServices.getUserOrdersFromDB({
    userId: user.id,
    query: req.query,
  });
  sendResponse(res, {
    data,
    statusCode: status.OK,
    success: true,
    message: "Orders retrieved successfully",
    meta,
  });
});

const getOrderById = catchAsync(async (req, res) => {
  const data = await OrderServices.getOrderByIdFromDB(req.params.id);
  sendResponse(res, {
    data,
    statusCode: status.OK,
    success: true,
    message: "Order retrieved successfully",
  });
});

const createOrder = catchAsync(async (req, res) => {
  const { user } = req;
  const data = await OrderServices.createOrderIntoDB(req.body, user);
  sendResponse(res, {
    data,
    statusCode: status.OK,
    success: true,
    message: "Order created successfully",
  });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  console.log(req.params.id);
  const data = await OrderServices.updateOrderStatusIntoDB({
    payload: req.body,
    id: req.params.id,
    user: req.user,
  });
  sendResponse(res, {
    data,
    statusCode: status.OK,
    success: true,
    message: "Order updated successfully",
  });
});

export const OrderControllers = {
  getOrders,
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
};
