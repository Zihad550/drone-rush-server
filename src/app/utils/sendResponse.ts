import type { Response } from "express";

interface IMeta {
  limit: number;
  page: number;
  total: number;
  total_page: number;
}

interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: IMeta;
  data: T;
}

function send_response<T>(res: Response, data: IResponse<T>) {
  const { statusCode, success, message, meta } = data;
  res.status(statusCode).json({
    success,
    message,
    data: data.data,
    meta,
  });
}

export default send_response;
