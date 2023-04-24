import { Hotel } from '@prisma/client';
import { notFoundError, paymentError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { hotelsRepository } from '@/repositories';
import ticketsRepository from '@/repositories/tickets-repository';

async function enrollmentTicketValidation(userId: number) {
  const enrollment = await enrollmentRepository.findenrollmentByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTickets(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.status !== 'PAID' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw paymentError();

  return;
}

async function getHotels(userId: number) {
  await enrollmentTicketValidation(userId);

  const hotels = await hotelsRepository.getHotels();
  if (hotels.length === 0) throw notFoundError();

  return hotels;
}

async function getHotelbyId(userId: number, id: number) {
  await enrollmentTicketValidation(userId);

  const hotel = await hotelsRepository.getHotelbyId(id);
  if (!hotel) throw notFoundError();

  return hotel;
}

export type HotelIdParams = Pick<Hotel, 'id'>;

export const hotelsService = {
  getHotels,
  getHotelbyId,
};
