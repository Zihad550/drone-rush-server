import { model, Schema } from "mongoose";
import IOrder from "./dronerushOrder.interface";

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "drUser",
    },
    shippingInformation: {
      type: Schema.Types.ObjectId,
      ref: "drShippingInformation",
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "drProduct",
    },
  },
  {
    timestamps: true,
  },
);

const Order = model<IOrder>("drOrder", orderSchema, "dronerush_orders");
export default Order;
