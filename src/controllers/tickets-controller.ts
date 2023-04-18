import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const types = await ticketsService.getTicketsTypes();
    res.status(httpStatus.OK).send(types);
  } catch (error) {
    next(error);
  }
}

export async function getTickets(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const types = await ticketsService.getTickets(req.userId);
    res.status(httpStatus.OK).send(types);
  } catch (error) {
    next(error);
  }
}
