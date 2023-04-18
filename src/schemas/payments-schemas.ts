import Joi from 'joi';

export const ticketIdPaymentSchema = Joi.object({
  ticketId: Joi.string()
    .regex(/^[0-9]+$/)
    .required(),
});

export const PaymentSchema = Joi.object({
  ticketId: Joi.number().required(),
  cardData: Joi.object({
    issuer: Joi.string().required(),
    number: Joi.number().required(),
    name: Joi.string().required(),
    expirationDate: Joi.string().required(),
    cvv: Joi.number().required(),
  }).required(),
});
