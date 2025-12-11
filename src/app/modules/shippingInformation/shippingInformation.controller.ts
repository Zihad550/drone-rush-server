import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ShippingInformationService } from "./shippingInformation.service";

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

const getUserShippingInformations = catchAsync(async (req, res) => {
  const user = req.user;

  const data =
    await ShippingInformationService.getShippingInformationByUserIdFromDb(
      user.id,
    );

  sendResponse(res, {
    data,
    message: "Shipping information fetched successfully",
    statusCode: status.OK,
    success: true,
  });
});

const createShippingInformation = catchAsync(async (req, res) => {
  const user = req.user;
  const payload = {
    ...req.body,
    user: user.id,
  };

  const data =
    await ShippingInformationService.createShippingInformationIntoDb(payload);

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
  const data = await ShippingInformationService.deleteShippingInformationFromDB(
    id,
    req.user,
  );

  sendResponse(res, {
    data,
    message: "Shipping information deleted successfully",
    statusCode: status.OK,
    success: true,
  });
});

const getShippingInformationById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data =
    await ShippingInformationService.getShippingInformationByIdFromDb(
      id,
      req.user,
    );

  sendResponse(res, {
    data,
    message: "Shipping information fetched successfully",
    statusCode: status.OK,
    success: true,
  });
});

export const ShippingInformationControllers = {
  getAllShippingInformation,
  getUserShippingInformations,
  createShippingInformation,
  updateShippingInformation,
  deleteShippingInformation,
  getShippingInformationById,
};
