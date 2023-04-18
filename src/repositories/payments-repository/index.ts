import { prisma } from '@/config';
import { PaymentData } from '@/protocols';

async function getPayments(ticketId: number) {
  return prisma.payment.findFirst({ where: { ticketId } });
}

async function postPayments({ ticketId, cardIssuer, cardLastDigits, value }: PaymentData) {
  return prisma.payment.create({ data: { ticketId, cardIssuer, cardLastDigits, value } });
}

const paymentsRepository = { getPayments, postPayments };

export default paymentsRepository;
