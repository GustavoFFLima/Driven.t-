import supertest from 'supertest';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import faker from '@faker-js/faker';
import { Hotel, TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createBooking,
  createEnrollmentWithAddress,
  createHotelTicketType,
  createNoHotelTicketType,
  createRemoteTicketType,
  createTicket,
  createTicketType,
  createUser,
} from '../factories';
import { createHotel, createRoom } from '../factories/hotels-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

function invalidTokenValidation(route: string, method: 'get' | 'post' | 'put') {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server[method](`${route}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server[method](`${route}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server[method](`${route}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
}

function enrollmentAndTicketValidation(route: string, method: 'post' | 'put', body: { roomId: number }) {
  it('should respond with status 404 if user dosent have enrollment yet', async () => {
    const token = await generateValidToken();

    const response = await server[method](`${route}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 if user doesnt have ticket yet', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);

    const response = await server[method](`${route}`).send(body).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it(`should respond with status 403 if user's ticket is not paid`, async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const response = await server[method](`${route}`).send(body).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it(`should respond with status 403 if user's ticket is remote`, async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createRemoteTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server[method](`${route}`).send(body).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });
  it(`should respond with status 403 if user's ticket doesnt't includes hotel`, async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createNoHotelTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server[method](`${route}`).send(body).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });
}

describe('POST /booking', () => {
  invalidTokenValidation('/booking', 'post');

  describe('when token is valid', () => {
    enrollmentAndTicketValidation('/booking', 'post', { roomId: 1 });

    it(`should respond with status 404 there is no room`, async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createHotelTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      await createHotel();

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    // it(`should respond with status 403 there is no room`, async () => {
    //   const user = await createUser();
    //   const token = await generateValidToken(user);
    //   const enrollment = await createEnrollmentWithAddress(user);
    //   const ticketType = await createHotelTicketType();
    //   await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    //   const hotel = await createHotel();

    //   const room = await createRoom(hotel.id);
    //   await createBooking(user.id, room.id);

    //   const response = await server.get('/booking').set('Authorization', `Bearer ${token}`).send({roomId: room.id});

    //   expect(response.status).toBe(httpStatus.FORBIDDEN);
    // });

    // it(`should respond with status 200 and hotel array with hotel`, async () => {
    //   const user = await createUser();
    //   const token = await generateValidToken(user);
    //   const enrollment = await createEnrollmentWithAddress(user);
    //   const ticketType = await createHotelTicketType();
    //   await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    //   const hotel = await createHotel();

    //   const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    //   const booking = response.body as Hotel[];

    //   expect(response.status).toBe(httpStatus.OK);
    //   expect(hotels).toEqual([
    //     {
    //       id: hotel.id,
    //       name: hotel.name,
    //       image: hotel.image,
    //       createdAt: hotel.createdAt.toISOString(),
    //       updatedAt: hotel.updatedAt.toISOString(),
    //     },
    //   ]);
    // });
  });
});
