import { z } from 'zod';

export const createUserSchema = z
  .object({
    contact: z.string(),
    password: z.string()
  })
  .strict();

export const getUserSchema = z
  .object({
    user_id: z.string().optional(),
    contact: z.string().optional()
  })
  .strict()
  .refine(
    (obj) => {
      const keys = Object.keys(obj);
      return keys.length > 0;
    },
    {
      message: 'At least one parameter is required'
    }
  );
