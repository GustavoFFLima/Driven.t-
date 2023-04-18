import { Router } from 'express';
import { authenticateToken, validateBody, validateQuery } from '@/middlewares';
import { getPayments, postPayments } from '@/controllers';
import { ticketIdPaymentSchema, PaymentSchema } from '@/schemas';

const paymentsRouter = Router();

paymentsRouter
  .all('*', authenticateToken)
  .get('/', validateQuery(ticketIdPaymentSchema), getPayments)
  .post('/process', validateBody(PaymentSchema), postPayments);

export { paymentsRouter };
