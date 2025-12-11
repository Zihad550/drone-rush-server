import type { ZodError, ZodIssue } from "zod";
import type {
  IErrorSource,
  IGenericErrorResponse,
} from "../interface/error.interface";

const handleZodError = (err: ZodError): IGenericErrorResponse => {
  const statusCode = 400;
  const errorSources: IErrorSource[] = err.issues.map((issue: ZodIssue) => ({
    path: issue?.path[issue.path.length - 1] as string | number,
    message: issue.message,
  }));
  return {
    statusCode,
    message: "Zod Validation Error",
    errorSources,
  };
};
export default handleZodError;
