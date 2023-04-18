import Joi from 'joi';

export const ticketIdPaymentSchema = Joi.object({
  ticketId: Joi.string()
    .regex(/^[0-9]+$/)
    .required(),
});
