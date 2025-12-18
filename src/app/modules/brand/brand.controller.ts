import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BrandServices } from "./brand.service";

const get_brands = catchAsync(async (req, res) => {
  const { meta, data } = await BrandServices.get_brands_from_db(req.query);
  sendResponse(res, {
    data,
    message: "Brands fetched successfully",
    statusCode: status.OK,
    success: true,
    meta,
  });
});

const create_brand = catchAsync(async (req, res) => {
  const data = await BrandServices.create_brand_into_db(req.body, req.file);
  sendResponse(res, {
    data,
    message: "Brand created successfully",
    statusCode: status.CREATED,
    success: true,
  });
});

const get_brand_by_id = catchAsync(async (req, res) => {
  const data = await BrandServices.get_brand_by_id_from_db(req.params.id);
  sendResponse(res, {
    data,
    message: "Brand fetched successfully",
    statusCode: status.OK,
    success: true,
  });
});

const update_brand = catchAsync(async (req, res) => {
  const data = await BrandServices.update_brand_into_db(
    req.params.id,
    req.body,
    req.file,
  );
  sendResponse(res, {
    data,
    message: "Brand updated successfully",
    statusCode: status.OK,
    success: true,
  });
});

const delete_brand = catchAsync(async (req, res) => {
  const data = await BrandServices.delete_brand_from_db(req.params.id);
  sendResponse(res, {
    data,
    message: "Brand deleted successfully",
    statusCode: status.OK,
    success: true,
  });
});

export const BrandControllers = {
  get_brands,
  create_brand,
  get_brand_by_id,
  update_brand,
  delete_brand,
};
