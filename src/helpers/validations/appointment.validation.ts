import { z } from 'zod';

export const appointmentSchema = z
  .object({
    center_id: z.string(), // Assuming center_id is a string
    user_id: z.string(), // Assuming user_id is a string
    appointment_date: z.date()
  })
  .strict();
