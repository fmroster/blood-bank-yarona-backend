import { z } from 'zod';
import { numberPattern } from './user.validation';

import { createUserSchema } from './user.validation';

export const donationCenterSchema = z
  .object({
    center_name: z.string(),
    location: z.string().optional()
  })
  .merge(createUserSchema)
  .strict();

export const getDonationCenterSchema = z
  .object({
    center_name: z.string().optional(),
    location: z.string().optional(),
    center_id: z.string().optional()
  })
  .strict();
