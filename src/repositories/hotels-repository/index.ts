import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

async function getHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

async function getHotelbyId(id: number): Promise<
  Hotel & {
    Rooms: Room[];
  }
> {
  return prisma.hotel.findUnique({ where: { id }, include: { Rooms: true } });
}

export const hotelsRepository = { getHotels, getHotelbyId };
