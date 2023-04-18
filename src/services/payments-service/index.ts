import { notFoundError, unauthorizedError } from '@/errors';
import paymentsRepository from '@/repositories/payments-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { CardData } from '@/protocols';

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

export async function postPayments(ticketId: number, cardData: CardData, userId: number) {
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

  const ticketType = await ticketsRepository.findTypeById(typesTicket.ticketTypeId);

  await paymentsRepository.postPayments({
    ticketId,
    value: ticketType.price,
    cardIssuer: cardData.issuer,
    cardLastDigits: cardData.number.toLocaleString().slice(-4),
  });

  await ticketsRepository.updatePayment(ticketId);

  const types = await paymentsRepository.getPayments(ticketId);

  return types;
}

const paymentsService = { getPayments, postPayments };

export default paymentsService;
