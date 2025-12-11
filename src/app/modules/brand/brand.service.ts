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

export const BrandServices = {
  getBrandsFromDB,
  createBrandIntoDB,
};
