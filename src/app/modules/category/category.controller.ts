import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CategoryServices } from "./category.service";

const getCategories = catchAsync(async (req, res) => {
  const { meta, data } = await CategoryServices.getCategoriesFromDB(req.query);
  sendResponse(res, {
    data,
    message: "Categories fetched successfully",
    statusCode: status.OK,
    success: true,
    meta,
  });
});

const createCategory = catchAsync(async (req, res) => {
  const data = await CategoryServices.createCategoryIntoDB(req.body);
  sendResponse(res, {
    data,
    message: "Category created successfully",
    statusCode: status.CREATED,
    success: true,
  });
});

const getDronesByCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { meta, data } = await CategoryServices.getDronesByCategoryFromDB(
    id,
    req.query,
  );
  sendResponse(res, {
    data,
    message: "Drones fetched successfully for category",
    statusCode: status.OK,
    success: true,
    meta,
  });
});

export const CategoryControllers = {
  getCategories,
  createCategory,
  getDronesByCategory,
};
