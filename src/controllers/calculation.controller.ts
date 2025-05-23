import { NextFunction, Request, Response } from 'express';
import { calculateFootprint } from '../services/calculation.service';

export const getFootprint = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const footprint = await calculateFootprint(req.body);
    res.status(201).json(footprint);
  } catch (error) {
    next(error);
  }
};
