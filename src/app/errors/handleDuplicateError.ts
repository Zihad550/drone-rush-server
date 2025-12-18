import type {
  IErrorSource,
  IGenericErrorResponse,
} from "../interface/error.interface";

const handle_duplicate_error = (err: any): IGenericErrorResponse => {
  const match = err?.message.match(/"([^"]*)"/);
  const extracted_msg = match?.[1];
  const error_sources: IErrorSource[] = [
    {
      path: "",
      message: `${extracted_msg} is already exists`,
    },
  ];
  const status_code = 400;

  return {
    statusCode: status_code,
    errorSources: error_sources,
    message: "Duplicate entry found",
  };
};

export default handle_duplicate_error;
