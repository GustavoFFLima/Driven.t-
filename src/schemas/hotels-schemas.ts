import Joi from 'joi';
import { HotelIdParams } from '@/services';

export const HotelIdSchema = Joi.object<HotelIdParams>({
  id: Joi.number().required(),
});
