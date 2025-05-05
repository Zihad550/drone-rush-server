import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userName: string;
      userId: string;
      user: JwtPayload;
    }
  }
}
