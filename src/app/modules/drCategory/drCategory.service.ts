import QueryBuilder from "../../builder/QueryBuilder";
import { CategorySearchableFields } from "./drCategory.constant";
import type ICategory from "./drCategory.interface";
import Category from "./drCategory.model";

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

export const CategoryServices = {
	getCategoriesFromDB,
	createCategoryIntoDB,
};
