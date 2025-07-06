import { model, Schema } from "mongoose";
import { OrderStatuses } from "./drOrder.constant";
import IOrder from "./drOrder.interface";

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "drUser",
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "drUser",
      required: false,
    },
    shippingInformation: {
      type: Schema.Types.ObjectId,
      ref: "drShippingInformation",
    },
    products: {
      type: Schema.Types.ObjectId,
      ref: "drProduct",
    },
    status: {
      type: String,
      enum: OrderStatuses,
      default: "processing",
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

const Order = model<IOrder>("drOrder", orderSchema, "dronerush_orders");
export default Order;
