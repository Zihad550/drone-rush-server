import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BrandServices } from "./brand.service";

const getBrands = catchAsync(async (req, res) => {
  const { meta, data } = await BrandServices.getBrandsFromDB(req.query);
  sendResponse(res, {
    data,
    message: "Brands fetched successfully",
    statusCode: status.OK,
    success: true,
    meta,
  });
});

const createBrand = catchAsync(async (req, res) => {
  const data = await BrandServices.createBrandIntoDB(req.body);
  sendResponse(res, {
    data,
    message: "Brand created successfully",
    statusCode: status.CREATED,
    success: true,
  });
});

const getBrandById = catchAsync(async (req, res) => {
  const data = await BrandServices.getBrandByIdFromDB(req.params.id);
  sendResponse(res, {
    data,
    message: "Brand fetched successfully",
    statusCode: status.OK,
    success: true,
  });
});

const updateBrand = catchAsync(async (req, res) => {
  const data = await BrandServices.updateBrandIntoDB(req.params.id, req.body);
  sendResponse(res, {
    data,
    message: "Brand updated successfully",
    statusCode: status.OK,
    success: true,
  });
});

const deleteBrand = catchAsync(async (req, res) => {
  const data = await BrandServices.deleteBrandFromDB(req.params.id);
  sendResponse(res, {
    data,
    message: "Brand deleted successfully",
    statusCode: status.OK,
    success: true,
  });
});

export const BrandControllers = {
  getBrands,
  createBrand,
  getBrandById,
  updateBrand,
  deleteBrand,
};
