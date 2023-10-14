import z from 'zod';

export const tagSchema = z.object({
 name: z
    .string()
    .refine(
      (value) => value.trim() !== '',
      { message: 'A tag name is required' }
    )
    .refine(
      (value) => value.trim().length <= 50,
      { message: 'The maximum length for a tag is 50 characters' }
    )
    .refine(
      (value) => !/\s{2,}/.test(value),
      { message: 'Consecutive spaces are not allowed' }
    ),
});

export type TagSchemaType = z.infer<typeof tagSchema>;
