import { z } from 'zod';

export const bloodRequestSchema = z
  .object({
    blood_group: z.string(),
    center_id: z.string(), // Assuming center_id is a string
    status: z.boolean()
  })
  .strict();
