import { z } from 'zod';

export const donationCenterSchema = z
  .object({
    centerName: z.string()
  })
  .strict();
