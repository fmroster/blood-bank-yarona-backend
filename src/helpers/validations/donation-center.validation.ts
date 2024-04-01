import { z } from 'zod';

export const createDonationCenterSchema = z
  .object({
    centerName: z.string()
  })
  .strict();
