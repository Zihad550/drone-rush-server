import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductServices } from "./drProduct.service";

const getProducts = catchAsync(async (req, res) => {
  const { data, meta } = await ProductServices.getProductsFromDB(req.query);
  sendResponse(res, {
    data,
    statusCode: status.OK,
    success: true,
    message: "Products retrieved successfully",
    meta,
  });
});

const getProductById = catchAsync(async (req, res) => {
  const data = await ProductServices.getProductByIdFromDB(req.params.id);
  sendResponse(res, {
    data,
    statusCode: status.OK,
    success: true,
    message: "Product retrieved successfully",
  });
});

const createProduct = catchAsync(async (req, res) => {
  const data = await ProductServices.createProductIntoDB(req.body);
  sendResponse(res, {
    data,
    statusCode: status.OK,
    success: true,
    message: "Product created successfully",
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const data = await ProductServices.deleteProductByIdFromDB(req.params.id);

  sendResponse(res, {
    data,
    statusCode: status.OK,
    success: true,
    message: "Product deleted successfully",
  });
});

export const ProductControllers = {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
};
