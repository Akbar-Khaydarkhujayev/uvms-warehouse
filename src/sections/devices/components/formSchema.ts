import { z } from 'zod';

// ----------------------------------------------------------------------

export type FormSchemaType = z.infer<typeof FormSchema>;

export const FormSchema = z.object({
  device_id: z.string().optional(),
  device_Name: z
    .string()
    .min(1, { message: 'Device name is required!' })
    .min(3, { message: 'Minimum 3 characters!' })
    .max(32, { message: 'Maximum 32 characters!' }),
  dev_Username: z.string().min(1, { message: 'Username is required!' }),
  dev_Password: z.string().min(1, { message: 'Password is required!' }),
  company_ID: z.string().min(1, { message: 'Company is required!' }),
  direction: z.number().int().min(0, { message: 'Direction must be a non-negative integer!' }),
});

export type DeviceUserFormSchemaType = z.infer<typeof DeviceUserFormSchema>;

export const DeviceUserFormSchema = z.object({
  user_ID: z.string().min(1, { message: 'User ID is required!' }),
  user_Name: z
    .string()
    .min(1, { message: 'User name is required!' })
    .min(3, { message: 'Minimum 3 characters!' })
    .max(32, { message: 'Maximum 32 characters!' }),
  faceImage: z.string().min(1, { message: 'Face image is required!' }),
  valid_StartTime: z
    .string()
    .min(1, { message: 'Valid start time is required!' })
    .refine((val) => !Number.isNaN(Date.parse(val)), {
      message: 'Valid start time must be a valid datetime string!',
    }),
  valid_EndTime: z
    .string()
    .min(1, { message: 'Valid end time is required!' })
    .refine((val) => !Number.isNaN(Date.parse(val)), {
      message: 'Valid end time must be a valid datetime string!',
    }),
});
