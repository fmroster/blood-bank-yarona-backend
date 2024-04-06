import { z } from 'zod';

export const donationCenterSchema = z
  .object({
    center_name: z.string(),
    location: z.string().optional()
  })
  .strict();

export const getDonationCenterSchema = z
  .object({
    center_name: z.string().optional(),
    location: z.string().optional()
  })
  .strict();
