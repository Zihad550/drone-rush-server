import { model, Schema } from "mongoose";
import { OrderStatuses } from "./order.constant";
import type IOrder from "./order.interface";
import type { IOrderDrone } from "./order.interface";

const orderDroneSchema = new Schema<IOrderDrone>({
  id: {
    type: Schema.Types.ObjectId,
    ref: "Drone",
  },
  quantity: {
    type: Number,
    min: 1,
    required: true,
  },
});

const orderReviewSchema = new Schema({
  drone: {
    type: Schema.Types.ObjectId,
    ref: "Drone",
  },
  review: {
    type: Schema.Types.ObjectId,
    ref: "Review",
  },
});

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    shippingInformation: {
      type: Schema.Types.ObjectId,
      ref: "ShippingInformation",
    },
    drones: [orderDroneSchema],
    reviews: {
      type: [orderReviewSchema],
      default: [],
    },
    status: {
      type: String,
      enum: OrderStatuses,
      default: "PROCESSING",
    },
    cancelReason: {
      type: String,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Order = model<IOrder>("Order", orderSchema);
export default Order;
