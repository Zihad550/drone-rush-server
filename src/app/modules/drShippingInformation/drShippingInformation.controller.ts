import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ShippingInformationService } from "./drShippingInformation.service";

const getAllShippingInformation = catchAsync(async (req, res) => {
  const { meta, data } =
    await ShippingInformationService.getAllShippingInformationFromDb(req.query);

  sendResponse(res, {
    data,
    meta,
    message: "Shipping information fetched successfully",
    statusCode: status.OK,
    success: true,
  });
});

const getShippingInformationByUserId = catchAsync(async (req, res) => {
  const data =
    await ShippingInformationService.getShippingInformationByUserIdFromDb(
      req.user.id,
    );

  sendResponse(res, {
    data,
    message: "Shipping information fetched successfully",
    statusCode: status.OK,
    success: true,
  });
});

const createShippingInformation = catchAsync(async (req, res) => {
  const data = await ShippingInformationService.createShippingInformationIntoDb(
    req.body,
  );

  sendResponse(res, {
    data,
    message: "Shipping information created successfully",
    statusCode: status.CREATED,
    success: true,
  });
});

const updateShippingInformation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await ShippingInformationService.updateShippingInformationIntoDB(
    id,
    req.body,
  );

  sendResponse(res, {
    data,
    message: "Shipping information updated successfully",
    statusCode: status.OK,
    success: true,
  });
});

const deleteShippingInformation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data =
    await ShippingInformationService.deleteShippingInformationFromDB(id);

  sendResponse(res, {
    data,
    message: "Shipping information deleted successfully",
    statusCode: status.OK,
    success: true,
  });
});

export const ShippingInformationControllers = {
  getAllShippingInformation,
  getShippingInformationByUserId,
  createShippingInformation,
  updateShippingInformation,
  deleteShippingInformation,
};
