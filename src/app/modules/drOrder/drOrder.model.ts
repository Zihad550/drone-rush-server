import { model, Schema } from "mongoose";
import { OrderStatuses } from "./drOrder.constant";
import IOrder, { IOrderProduct } from "./drOrder.interface";

const orderProductSchema = new Schema<IOrderProduct>({
  id: {
    type: Schema.Types.ObjectId,
    ref: "drProduct",
  },
  quantity: {
    type: Number,
    min: 1,
    required: true,
  },
});

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
    products: [orderProductSchema],
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
