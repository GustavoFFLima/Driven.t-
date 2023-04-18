import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';

export async function getPayments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { ticketId } = req.query as { ticketId: string };
  try {
    const types = await paymentsService.getPayments(req.userId, parseInt(ticketId));
    res.status(httpStatus.OK).send(types);
  } catch (error) {
    next(error);
  }
}
