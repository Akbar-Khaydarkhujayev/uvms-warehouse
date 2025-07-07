import { z } from 'zod';

// ----------------------------------------------------------------------

export type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  id: z.string().optional(),
  arendator: z.string().min(1, { message: 'Required!' }),
  tgUserId: z.string().min(1, { message: 'Required!' }),
  status: z.boolean(),
});
