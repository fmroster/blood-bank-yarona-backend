import { z } from 'zod';

export const createBloodDonationSchema = z
  .object({
    donor_id: z.string(), // Assuming donor_id is a string
    blood_group: z.string(),
    donation_date: z.date(),
    center_id: z.string() // Assuming center_id is a string
  })
  .strict();
