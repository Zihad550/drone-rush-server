import QueryBuilder from "../../builder/QueryBuilder";
import { DroneServices } from "../drone/drone.service";
import { CategorySearchableFields } from "./category.constant";
import type ICategory from "./category.interface";
import Category from "./category.model";

async function getCategoriesFromDB(query: Record<string, unknown>) {
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
}

async function createCategoryIntoDB(payload: ICategory) {
  return await Category.create(payload);
}

async function updateCategoryIntoDB(id: string, payload: Partial<ICategory>) {
  return await Category.findByIdAndUpdate(id, payload, { new: true });
}

async function deleteCategoryFromDB(id: string) {
  return await Category.findByIdAndDelete(id);
}

async function getDronesByCategoryFromDB(
  id: string,
  query: Record<string, unknown>,
) {
  // Force category filter
  query.category = [id];
  return DroneServices.getDronesFromDB(query);
}

export const CategoryServices = {
  getCategoriesFromDB,
  createCategoryIntoDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
  getDronesByCategoryFromDB,
};
