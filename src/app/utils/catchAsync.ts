import type { RequestHandler } from "express";

function catch_async(fn: RequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
}

export default catch_async;
