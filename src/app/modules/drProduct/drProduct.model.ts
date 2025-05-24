import { model, Schema } from "mongoose";
import IProduct from "./drProduct.interface";

const productSchema = new Schema<IProduct>(
  {
    img: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Product = model<IProduct>(
  "drProduct",
  productSchema,
  "dronerush_products",
);
