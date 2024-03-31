import { coerce, z } from 'zod';
import { createUserSchema } from './user.validation';

export const createDonorSchema = z
  .object({
    first_name: z.string(),
    last_name: z.string(),
    gender: z.string(),
    date_of_birth: coerce.date({
      required_error: 'Date is required',
      invalid_type_error: 'Invalid date'
    }),
    nationality: z.string(),
    identification: z.string()
  })
  .merge(createUserSchema)
  .strict();
