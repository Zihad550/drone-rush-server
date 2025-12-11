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

export const BrandControllers = {
  getBrands,
  createBrand,
};
