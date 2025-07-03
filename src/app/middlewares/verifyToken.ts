import jwt from "jsonwebtoken";

import config from "../config";
import catchAsync from "../utils/catchAsync";
import { IJwtPayload } from "../interface";

const verifyToken = catchAsync(async (req, res, next) => {
  const token = req.headers?.authorization;
  if (!token) throw new Error("Token not found");

  const decoded = jwt.verify(token, config.jwt_access_secret) as IJwtPayload;
  const user = decoded;
  req.user = user;
  next();
});

export default verifyToken;
