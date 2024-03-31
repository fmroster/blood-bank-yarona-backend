import { z } from 'zod';

export const userSchema = z
  .object({
    contact: z.string(),
    password: z.string()
  })
  .strict();
