import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

export default {
  NODE_ENV: process.env.NODE_ENV as string,
  port: process.env.PORT as string,
  database_uri: process.env.URI as string,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET as string,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN as string,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET as string,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN as string,
  DEV_APP_URL: process.env.DEV_APP_URL as string,
  PRO_APP_URL: process.env.PRO_APP_URL as string,
};
