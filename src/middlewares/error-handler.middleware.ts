import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app.error';

export const errorHandlerMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);
  const error = {
    code: err.status,
    message: err.message || 'Internal Server Error'
  };
  res.status(err.status || 500).json(error);
};
