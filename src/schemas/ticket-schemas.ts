import Joi from 'joi';

export const ticketIDSchema = Joi.object({
  ticketTypeId: Joi.number().required(),
});
