import { forbidden, notFoundError } from '@/errors';
import { hotelsRepository } from '@/repositories';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function enrollmentTicketValidation(userId: number) {
  const enrollment = await enrollmentRepository.findenrollmentByUserId(userId);
  console.log(`!enrollment1`);
  if (!enrollment) {
    console.log(`!enrollment2`);
    throw notFoundError();
  }

  const ticket = await ticketsRepository.getTickets(enrollment.id);
  if (!ticket) {
    console.log(`!ticket`);
    throw notFoundError();
  }

  if (ticket.status !== 'PAID' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw forbidden();

  return;
}

async function getBooking(userId: number) {
  const booking = await bookingRepository.getBooking(userId);
  if (!booking) throw notFoundError();
  return booking;
}

async function postBooking(userId: number, roomId: number) {
  await enrollmentTicketValidation(userId);
  const room = await hotelsRepository.getRoom(roomId);
  if (!room) throw notFoundError();
  if (room.Booking.length >= room.capacity) {
    throw forbidden();
  }
  const booking = await bookingRepository.postBooking(userId, roomId);
  return {
    bookingId: booking.id,
  };
}

async function putBooking(userId: number, roomId: number, bookingId: number) {
  await enrollmentTicketValidation(userId);
  const room = await hotelsRepository.getRoom(roomId);
  if (!room) throw notFoundError();
  if (room.Booking.length >= room.capacity) {
    throw forbidden();
  }
  const findBooking = await bookingRepository.getBooking(userId);
  if (!findBooking) throw forbidden();
  const booking = await bookingRepository.putBooking(userId, roomId, bookingId);
  return {
    bookingId: booking.id,
  };
}
const bookingService = {
  getBooking,
  postBooking,
  putBooking,
};

export default bookingService;
