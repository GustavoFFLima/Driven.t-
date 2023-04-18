import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketsTypes, getTickets } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter.all('*', authenticateToken).get('/types', getTicketsTypes).get('/', getTickets);

export { ticketsRouter };
