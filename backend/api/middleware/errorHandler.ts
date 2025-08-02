import type { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  console.error(`Error ${statusCode}: ${message}`);
  console.error(error.stack);

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};
