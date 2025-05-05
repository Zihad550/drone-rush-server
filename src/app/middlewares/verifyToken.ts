import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import config from "../config";

async function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) throw new Error("Token not found");

    const decoded = jwt.verify(token, config.jwt_secret);
    console.log(decoded);
    const { userName, userId } = decoded as JwtPayload;
    req.userName = userName;
    req.userId = userId;
    req.user = userName;
    next();
  } catch {
    next("Authentication failed");
  }
}

export default verifyToken;
