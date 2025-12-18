import fs from "node:fs";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import multer from "multer";
import env from "../../env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CONFIG.CLOUD_NAME,
  api_key: env.CLOUDINARY_CONFIG.API_KEY,
  api_secret: env.CLOUDINARY_CONFIG.API_SECRET,
});

export const send_image_to_cloudinary = (
  image_name: string,
  path: string,
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      { public_id: image_name },
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result as UploadApiResponse);
        // delete a file asynchronously
        fs.unlink(path, (err) => {
          if (err) {
            throw err;
          } else {
            console.log("File is deleted.");
          }
        });
      },
    );
  });
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, `${process.cwd()}/uploads/`);
  },
  filename: (_req, file, cb) => {
    const unique_suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${unique_suffix}`);
  },
});

export const upload = multer({ storage: storage });
