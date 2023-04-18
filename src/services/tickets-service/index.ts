import { TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

export async function getTicketsTypes(): Promise<TicketType[]> {
  const types = await ticketsRepository.getTicketsTypes();

  if (!types) {
    throw notFoundError();
  }

  return types;
}

export async function getTickets(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const types = await ticketsRepository.getTickets(enrollment.id);

  if (!types) {
    throw notFoundError();
  }

  return types;
}

const ticketsService = { getTicketsTypes, getTickets };

export default ticketsService;
