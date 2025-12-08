import jwt, { type SignOptions } from "jsonwebtoken";
import type { IJwtPayload } from "../../interface";

export const createToken = (
	jwtPayload: IJwtPayload,
	secret: string,
	expiresIn: string,
) => {
	return jwt.sign(jwtPayload, secret, {
		expiresIn: expiresIn as SignOptions["expiresIn"],
	});
};

export const verifyToken = (token: string, secret: string) => {
	return jwt.verify(token, secret) as IJwtPayload;
};
