import z from 'zod';

export const tagSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Max length for tag is 30 characters'),
});

export type TagSchemaType = z.infer<typeof tagSchema>;
