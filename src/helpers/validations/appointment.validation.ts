import { coerce, z } from 'zod';
import { numberPattern } from './user.validation';
import { zodBooleanString } from './donor.validation';

export const appointmentSchema = z
  .object({
    center_id: z.number(),
    user_id: z.number(),
    appointment_date: coerce.date({
      required_error: 'Date is required',
      invalid_type_error: 'Invalid date'
    })
  })
  .strict();
export const getAppointmentSchema = z
  .object({
    center_id: z.string().regex(numberPattern, 'Enter a number').optional(),
    user_id: z.string().regex(numberPattern, 'Enter a number').optional(),
    status: zodBooleanString,
    appointment_id: z.string().optional()
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

export const getUserAppointmentSchema = z
  .object({
    user_id: z.string().regex(numberPattern, 'Enter a number')
  })
  .strict();

export const getCenterAppointmentSchema = z
  .object({
    center_id: z.string().regex(numberPattern, 'Enter a number'),
    status: zodBooleanString
  })
  .strict();

export const updateAppointmentSchema = z
  .object({
    appointment_id: z.string(),
    appointment_date: coerce.date({
      required_error: 'Date is required',
      invalid_type_error: 'Invalid date'
    })
  })
  .strict();

export const approveAppointmentSchema = z
  .object({
    appointment_id: z.string(),
    status: z.boolean()
  })
  .strict();
