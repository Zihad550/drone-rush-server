import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DroneServices } from "./drone.service";

const getDrones = catchAsync(async (req, res) => {
  const userId = req?.query?.userId;
  const query = req.query;
  if (query.userId) delete query.userId;
  console.log(userId);
  const { data, meta } = await DroneServices.getDronesFromDB(query, userId);
  sendResponse(res, {
    data,
    statusCode: status.OK,
    success: true,
    message: "Drones retrieved successfully",
    meta,
  });
});

const getDroneById = catchAsync(async (req, res) => {
  const userId = req?.query?.userId;
  const data = await DroneServices.getDroneByIdFromDB(req.params.id, userId);
  sendResponse(res, {
    data,
    statusCode: status.OK,
    success: true,
    message: "Drone retrieved successfully",
  });
});

const createDrone = catchAsync(async (req, res) => {
  const data = await DroneServices.createDroneIntoDB(req.body);
  sendResponse(res, {
    data,
    statusCode: status.OK,
    success: true,
    message: "Drone created successfully",
  });
});

const deleteDrone = catchAsync(async (req, res) => {
  const data = await DroneServices.deleteDroneByIdFromDB(req.params.id);

  sendResponse(res, {
    data,
    statusCode: status.OK,
    success: true,
    message: "Drone deleted successfully",
  });
});

export const DroneControllers = {
  getDrones,
  getDroneById,
  createDrone,
  deleteDrone,
};
