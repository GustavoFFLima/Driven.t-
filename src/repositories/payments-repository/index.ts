import { prisma } from '@/config';

async function getPayments(ticketId: number) {
  return prisma.payment.findFirst({ where: { ticketId } });
}

// async function postTickets(enrollmentId: number, ticketTypeId: number) {
//   return prisma.ticket.create({
//     data: {
//       enrollmentId,
//       ticketTypeId,
//       status: 'RESERVED',
//     },
//     include: {
//       TicketType: true,
//     },
//   });
// }
const paymentsRepository = { getPayments };

export default paymentsRepository;
