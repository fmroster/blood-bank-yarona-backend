import { z } from 'zod';

export const createUserSchema = z
  .object({
    contact: z.string(),
    password: z.string()
  })
  .strict();
