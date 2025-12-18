import type { ErrorRequestHandler } from "express";
import status from "http-status";
import { JsonWebTokenError } from "jsonwebtoken";
import { ZodError } from "zod";
import env from "../../env";
import AppError from "../errors/AppError";
import handle_cast_error from "../errors/handleCastError";
import handle_duplicate_error from "../errors/handleDuplicateError";
import handle_validation_error from "../errors/handleValidationError";
import handle_zod_error from "../errors/handleZodError";
import type { IErrorSource } from "../interface/error.interface";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const global_error_handler: ErrorRequestHandler = (err, _, res, __) => {
  // setting default values
  let statusCode = 500;
  let message = "Something went wrong!";

  let errorSources: IErrorSource[] = [
    {
      path: "",
      message: "Something went wrong!",
    },
  ];

  if (err instanceof ZodError) {
    const simplified_error = handle_zod_error(err);
    statusCode = simplified_error.statusCode;
    message = simplified_error.message;
    errorSources = simplified_error.errorSources;
  } else if (err?.name === "ValidationError") {
    const simplified_error = handle_validation_error(err);
    statusCode = simplified_error.statusCode;
    message = simplified_error.message;
    errorSources = simplified_error.errorSources;
  } else if (err?.name === "CastError") {
    const simplified_error = handle_cast_error(err);
    statusCode = simplified_error.statusCode;
    message = simplified_error.message;
    errorSources = simplified_error.errorSources;
  } else if (err?.code === 11000) {
    const simplified_error = handle_duplicate_error(err);
    statusCode = simplified_error.statusCode;
    message = simplified_error.message;
    errorSources = simplified_error.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err.status_code;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof JsonWebTokenError) {
    statusCode = status.UNAUTHORIZED;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: env.NODE_ENV === "development" ? err?.stack : null,
  });
};

export default global_error_handler;
