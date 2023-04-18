import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketsTypes, getTickets, postTickets } from '@/controllers';
import { ticketIDSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('*', authenticateToken)
  .get('/types', getTicketsTypes)
  .get('/', getTickets)
  .post('/', validateBody(ticketIDSchema), postTickets);

export { ticketsRouter };
