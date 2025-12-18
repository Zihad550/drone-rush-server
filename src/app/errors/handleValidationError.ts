import type mongoose from "mongoose";
import type {
  IErrorSource,
  IGenericErrorResponse,
} from "../interface/error.interface";

const handle_validation_error = (
  error: mongoose.Error.ValidationError,
): IGenericErrorResponse => {
  const error_sources: IErrorSource[] = Object.values(error.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => ({
      path: val?.path,
      message: val?.message,
    }),
  );
  const status_code = 400;
  return {
    statusCode: status_code,
    message: "Validation Error",
    errorSources: error_sources,
  };
};

export default handle_validation_error;
