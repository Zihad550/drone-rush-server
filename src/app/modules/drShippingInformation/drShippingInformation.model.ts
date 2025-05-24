import { model, Schema } from "mongoose";
import IShippingInfo from "./dronerushShippingInformation.interface";

const shippingInformationSchema = new Schema<IShippingInfo>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "drUser",
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    apt: {
      type: String,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ShippingInformation = model<IShippingInfo>(
  "drShippingInformation",
  shippingInformationSchema,
  "dronerush_shipping_informations",
);

export default ShippingInformation;
