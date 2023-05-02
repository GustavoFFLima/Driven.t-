import { prisma } from '@/config';

async function getBooking(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

async function postBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

async function putBooking(userId: number, roomId: number, id: number) {
  return prisma.booking.update({
    where: {
      id,
    },
    data: {
      userId,
      roomId,
    },
  });
}

const bookingRepository = {
  getBooking,
  postBooking,
  putBooking,
};

export default bookingRepository;
