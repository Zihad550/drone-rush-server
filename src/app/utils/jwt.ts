import jwt, { type SignOptions } from "jsonwebtoken";
import type { IJwtPayload } from "../interface";

export function generate_token(
  payload: IJwtPayload,
  secret: string,
  expires_in: string,
) {
  const token = jwt.sign(payload, secret, {
    expiresIn: expires_in,
  } as SignOptions);

  return token;
}

export function verify_token(token: string, secret: string) {
  const verified_token = jwt.verify(token, secret) as IJwtPayload;

  return verified_token;
}
