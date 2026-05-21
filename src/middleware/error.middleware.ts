import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/errors.js";
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
    });
  }

  console.error(err);
  return res.status(500).json({
    code: "InternalServerError",
    message: "Something went wrong!",
  });
}
