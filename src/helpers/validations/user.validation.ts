import { literal, optional, string, z } from 'zod';
export const numberPattern = /^[0-9]+$/;
export const createUserSchema = z
  .object({
    contact: z.string().email('Email is invalid'),
    user_id: z.string()
  })
  .strict();

export const getUserSchema = z
  .object({
    user_id: z.string().optional(),
    contact: optional(string().email('Email is invalid')).or(literal(''))
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
