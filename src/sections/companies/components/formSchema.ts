import { z } from 'zod';

// ----------------------------------------------------------------------

export type FormSchemaType = z.infer<typeof FormSchema>;

export const FormSchema = z.object({
  id: z.string().optional(),
  company_name: z
    .string()
    .min(1, { message: 'Company name is required!' })
    .min(3, { message: 'Mininum 3 characters!' })
    .max(32, { message: 'Maximum 32 characters!' }),
});
