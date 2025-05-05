import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

export default {
  port: process.env.PORT as string,
  database_uri: process.env.URI as string,
  jwt_secret: process.env.JWT_SECRET as string,
};
