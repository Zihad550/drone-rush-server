import type { ZodObject } from "zod";
import catchAsync from "../utils/catchAsync";

const validate_request = (schema: ZodObject) => {
  return catchAsync(async (req, res, next) => {
    let data: any;
    if (req?.body?.data) data = JSON.parse(req.body.data);
    else data = req?.body;
    await schema.parseAsync({
      body: data,
      cookies: req.cookies,
      params: req.params,
      query: req.query,
    });

    next();
  });
};

export default validate_request;
