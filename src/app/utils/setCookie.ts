import type { Response } from "express";

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

export function set_auth_cookie(res: Response, token_info: AuthTokens) {
  if (token_info.accessToken) {
    res.cookie("accessToken", token_info.accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      // domain: env.FRONTEND_DOMAIN,
    });
  }

  if (token_info.refreshToken) {
    res.cookie("refreshToken", token_info.refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      // domain: env.FRONTEND_DOMAIN,
    });
  }
}
