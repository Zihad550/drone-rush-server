import jwt, { type SignOptions } from "jsonwebtoken";
import type { IJwtPayload } from "../../interface";

export const create_token = (
  jwt_payload: IJwtPayload | Record<string, any>,
  secret: string,
  expires_in: string,
) => {
  return jwt.sign(jwt_payload, secret, {
    expiresIn: expires_in as SignOptions["expiresIn"],
  });
};

export const verify_token = (token: string, secret: string) => {
  return jwt.verify(token, secret) as IJwtPayload;
};
