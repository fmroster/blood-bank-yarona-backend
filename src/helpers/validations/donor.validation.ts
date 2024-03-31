import { z } from 'zod';

export const donorSchema = z
  .object({
    user_id: z.string(), // Assuming user_id is a string
    first_name: z.string(),
    last_name: z.string(),
    gender: z.string(),
    date_of_birth: z.date(),
    nationality: z.string(),
    identification: z.string()
  })
  .strict();
