import QueryBuilder from "../../builder/QueryBuilder";
import { DroneServices } from "../drone/drone.service";
import { CategorySearchableFields } from "./category.constant";
import type ICategory from "./category.interface";
import Category from "./category.model";

const getCategoriesFromDB = async (query: Record<string, unknown>) => {
  const categoriesQuery = new QueryBuilder(Category.find(), query)
    .search(CategorySearchableFields)
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

const createCategoryIntoDB = async (payload: ICategory) => {
  return await Category.create(payload);
};

const getDronesByCategoryFromDB = async (
  id: string,
  query: Record<string, unknown>,
) => {
  // Force category filter
  query.category = [id];
  return DroneServices.getDronesFromDB(query);
};

export const CategoryServices = {
  getCategoriesFromDB,
  createCategoryIntoDB,
  getDronesByCategoryFromDB,
};
