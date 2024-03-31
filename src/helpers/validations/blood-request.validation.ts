import { z } from 'zod';

export const createBloodRequestSchema = z
  .object({
    blood_group: z.string(),
    center_id: z.string()
  })
  .strict();
