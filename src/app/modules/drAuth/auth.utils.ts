import { IJwtPayload } from "../../interface";
import jwt, { SignOptions } from "jsonwebtoken";

export const createToken = (
  jwtPayload: IJwtPayload,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  });
};
