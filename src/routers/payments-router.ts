import { Router } from 'express';
import { authenticateToken, validateQuery } from '@/middlewares';
import { getPayments } from '@/controllers';
import { ticketIdPaymentSchema } from '@/schemas';

const paymentsRouter = Router();

paymentsRouter.all('*', authenticateToken).get('/', validateQuery(ticketIdPaymentSchema), getPayments);

export { paymentsRouter };
