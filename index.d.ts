import { IJwtPayload } from "./src/app/interface";

declare global {
  namespace Express {
    interface Request {
      user: IJwtPayload;
    }
  }
}
