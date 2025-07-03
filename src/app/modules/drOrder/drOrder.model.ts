import { model, Schema } from "mongoose";
import IOrder from "./drOrder.interface";
import { OrderStatuses } from "./drOrder.constant";

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
    product: {
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
  },
  {
    timestamps: true,
  },
);

const Order = model<IOrder>("drOrder", orderSchema, "dronerush_orders");
export default Order;
