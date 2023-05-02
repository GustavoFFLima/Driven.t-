import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const booking = await bookingService.getBooking(userId);
    return res.status(200).send(booking);
  } catch (error) {
    next(error);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { roomId } = req.body as { roomId: number };

  try {
    const booking = await bookingService.postBooking(userId, roomId);
    return res.status(200).send(booking);
  } catch (error) {
    next(error);
  }
}

export async function putBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { roomId } = req.body as { roomId: number };
  const bookingId = parseInt(req.params.bookingId);

  try {
    const booking = await bookingService.putBooking(userId, roomId, bookingId);
    return res.status(200).send(booking);
  } catch (error) {
    next(error);
  }
}
