import dotenv from "dotenv";
import path from "path";
import { z, ZodError } from "zod/v4";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_EXPIRES_IN: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string(),
  MAIL_APP_PASS: z.string(),
  MAIL_SENDER_MAIL: z.string(),
  RESET_PASS_UI_LINK: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  SUPER_ADMIN_PASSWORD: z.string(),
  SUPER_ADMIN_EMAIL: z.string(),
  DEV_APP_URL: z.string(),
  PRO_APP_URL: z.string(),
});

try {
  EnvSchema.parse(process.env);
} catch (err) {
  if (err instanceof ZodError) {
    let message = "Missing required values in .env:\n";
    message += Object.keys(z.flattenError(err).fieldErrors).join("\n");
    const e = new Error(message);
    e.stack = "";
    throw e;
  } else console.error(err);
}

export default EnvSchema.parse(process.env);
