import QueryBuilder from "../../builder/QueryBuilder";
import { BrandSearchableFields } from "./brand.constant";
import type IBrand from "./brand.interface";
import Brand from "./brand.model";

const getBrandsFromDB = async (query: Record<string, unknown>) => {
  const categoriesQuery = new QueryBuilder(Brand.find(), query)
    .search(BrandSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const data = await categoriesQuery.modelQuery;
  const meta = await categoriesQuery.countTotal();
  return {
    data,
    meta,
  };
};

const createBrandIntoDB = async (payload: IBrand) => {
  return await Brand.create(payload);
};

const getBrandByIdFromDB = async (id: string) => {
  const brand = await Brand.findById(id);
  if (!brand) {
    throw new Error("Brand not found");
  }
  return brand;
};

const updateBrandIntoDB = async (id: string, payload: Partial<IBrand>) => {
  const brand = await Brand.findByIdAndUpdate(id, payload, { new: true });
  if (!brand) {
    throw new Error("Brand not found");
  }
  return brand;
};

const deleteBrandFromDB = async (id: string) => {
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    throw new Error("Brand not found");
  }
  return brand;
};

export const BrandServices = {
  getBrandsFromDB,
  createBrandIntoDB,
  getBrandByIdFromDB,
  updateBrandIntoDB,
  deleteBrandFromDB,
};
