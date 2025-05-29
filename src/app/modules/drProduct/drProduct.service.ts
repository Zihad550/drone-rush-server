import status from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { ProductSearchableFields } from "./drProduct.constant";
import IProduct from "./drProduct.interface";
import Product from "./drProduct.model";

const getProductsFromDB = async (query: Record<string, unknown>) => {
  const productsQuery = new QueryBuilder(
    Product.find().populate("brand").populate("reviews").populate("category"),
    query,
  )
    .search(ProductSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const data = await productsQuery.modelQuery;
  const meta = await productsQuery.countTotal();
  return {
    data,
    meta,
  };
};

const getProductByIdFromDB = async (id: string) => {
  return await Product.findOne({ _id: id })
    .populate("brand")
    .populate("reviews")
    .populate("category");
};

const createProductIntoDB = async (payload: IProduct) => {
  return Product.create(payload);
};

const deleteProductByIdFromDB = async (id: string) => {
  const data = await Product.findOneAndDelete({ _id: id });
  if (!data) throw new AppError(status.NOT_FOUND, "Product not found!");
  return data;
};

export const ProductServices = {
  getProductsFromDB,
  getProductByIdFromDB,
  createProductIntoDB,
  deleteProductByIdFromDB,
};
