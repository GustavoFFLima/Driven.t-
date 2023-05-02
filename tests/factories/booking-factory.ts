import { prisma } from '@/config';

export async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: { userId: userId, roomId: roomId },
    include: { Room: true },
  });
}
