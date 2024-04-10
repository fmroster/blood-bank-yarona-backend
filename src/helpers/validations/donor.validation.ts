import { coerce, z } from 'zod';
import { createUserSchema, numberPattern } from './user.validation';

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
export const validateDonorSchema = z
  .object({
    identification: z.string(),
    verification: z.boolean()
  })
  .strict();
export const zodBooleanString = z
  .string() // Expecting a string value
  .optional()
  .transform((value) => {
    if (value == 'true') {
      return true;
    } else if (value == 'false') {
      return false;
    }
  });

export const getDonorSchema = z
  .object({
    user_id: z.string().optional(),
    identification: z.string().optional(),
    verification: zodBooleanString
  })
  .strict();
