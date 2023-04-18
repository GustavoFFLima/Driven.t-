import { TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function getTicketsTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function getTickets(enrollmentId: number) {
  return prisma.ticket.findFirst({ where: { enrollmentId }, include: { TicketType: true } });
}

async function getTicketById(id: number) {
  return prisma.ticket.findUnique({
    where: {
      id,
    },
  });
}

async function postTickets(enrollmentId: number, ticketTypeId: number) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status: 'RESERVED',
    },
    include: {
      TicketType: true,
    },
  });
}
const ticketsRepository = { getTicketsTypes, getTickets, postTickets, getTicketById };

export default ticketsRepository;
