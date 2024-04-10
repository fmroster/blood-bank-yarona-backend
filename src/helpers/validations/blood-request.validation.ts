import { z } from 'zod';
import { BloodType } from './blood-donation.validation';

export const createBloodRequestSchema = z
  .object({
    blood_group: z.nativeEnum(BloodType),
    center_id: z.string()
  })
  .strict();

export const getBloodRequestSchema = z
  .object({
    blood_group: z.nativeEnum(BloodType).optional(),
    center_id: z.string().optional(),
    location: z.string().optional(),
    request_id: z.string().optional()
  })
  .strict();

export const deactivateBloodRequestSchema = z
  .object({
    request_id: z.string()
  })
  .strict();
