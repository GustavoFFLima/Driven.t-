import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services';

export async function getHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const hotels = await hotelsService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    next(error);
  }
}

export async function getHotelbyId(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { id } = req.params as { id: string };
  try {
    const hotel = await hotelsService.getHotelbyId(userId, parseInt(id));
    return res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    next(error);
  }
}
