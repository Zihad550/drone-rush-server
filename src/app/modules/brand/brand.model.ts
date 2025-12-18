import { model, Schema } from "mongoose";
import type IBrand from "./brand.interface";

const brand_schema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Brand = model<IBrand>("Brand", brand_schema);

export default Brand;
