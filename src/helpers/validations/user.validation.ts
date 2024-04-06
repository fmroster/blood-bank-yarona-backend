import { z } from 'zod';
const numberPattern = /^[0-9]+$/;
export const createUserSchema = z
  .object({
    contact: z.string(),
    password: z.string()
  })
  .strict();

export const getUserSchema = z
  .object({
    user_id: z.string().regex(numberPattern).optional(),
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

export const deleteDonorSchema = z
  .object({
    identification: z.string()
  })
  .strict();
