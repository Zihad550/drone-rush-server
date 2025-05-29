import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderServices } from "./drOrder.service";

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
  const data = await OrderServices.createOrderIntoDB(req.body, user.id);
  sendResponse(res, {
    data,
    statusCode: status.OK,
    success: true,
    message: "Order created successfully",
  });
});

const updateOrder = catchAsync(async (req, res) => {
  const data = await OrderServices.updateOrderIntoDB({
    orderStatus: req.body.status,
    id: req.params.id,
  });
  sendResponse(res, {
    data,
    statusCode: status.OK,
    success: true,
    message: "Order updated successfully",
  });
});

export const OrderControllers = {
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrder,
};
