import z from 'zod';

export const tagSchema = z.object({
  name: z
    .string()
    .min(1, 'A tag name is required')
    .max(50, 'The maximum length for tag is 50 characters'),
});

export type TagSchemaType = z.infer<typeof tagSchema>;
