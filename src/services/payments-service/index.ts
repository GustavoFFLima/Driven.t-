import { notFoundError, unauthorizedError } from '@/errors';
import paymentsRepository from '@/repositories/payments-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

export async function getPayments(userId: number, ticketId: number) {
  const typesTicket = await ticketsRepository.getTicketById(ticketId);
  if (!typesTicket) {
    throw notFoundError();
  }

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  if (typesTicket.enrollmentId !== enrollment.id) {
    throw unauthorizedError();
  }

  const types = await paymentsRepository.getPayments(ticketId);

  return types;
}

const paymentsService = { getPayments };

export default paymentsService;
