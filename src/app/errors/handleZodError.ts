import type { ZodError, ZodIssue } from "zod";
import type {
  IErrorSource,
  IGenericErrorResponse,
} from "../interface/error.interface";

const handle_zod_error = (err: ZodError): IGenericErrorResponse => {
  const status_code = 400;
  const error_sources: IErrorSource[] = err.issues.map((issue: ZodIssue) => ({
    path: issue?.path[issue.path.length - 1] as string | number,
    message: issue.message,
  }));
  return {
    statusCode: status_code,
    message: "Zod Validation Error",
    errorSources: error_sources,
  };
};
export default handle_zod_error;
