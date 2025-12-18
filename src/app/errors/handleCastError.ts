import type mongoose from "mongoose";
import type {
  IErrorSource,
  IGenericErrorResponse,
} from "../interface/error.interface";

const handle_cast_error = (
  err: mongoose.Error.CastError,
): IGenericErrorResponse => {
  const error_sources: IErrorSource[] = [
    {
      path: err.path,
      message: err.message,
    },
  ];
  const status_code = 400;
  return {
    statusCode: status_code,
    message: "Invalid ID",
    errorSources: error_sources,
  };
};

export default handle_cast_error;
