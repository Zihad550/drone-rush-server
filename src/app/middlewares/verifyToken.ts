import jwt, { JwtPayload } from "jsonwebtoken";

import config from "../config";
import catchAsync from "../utils/catchAsync";

const verifyToken = catchAsync(async (req, res, next) => {
  const token = req.headers?.authorization;
  if (!token) throw new Error("Token not found");

  const decoded = jwt.verify(token, config.jwt_access_secret);
  const user = decoded as JwtPayload;
  (req as any).user = user;
  next();
});

export default verifyToken;
