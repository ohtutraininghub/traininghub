import z from 'zod';

export const maxTagLength = 50;

export const tagSchema = z.object({
  name: z
    .string()
    .refine((value) => value.trim() !== '', {
      message: 'A tag name is required',
    })
    .refine((value) => value.trim().length <= maxTagLength, {
      message: `The maximum length for a tag is ${maxTagLength} characters`,
    })
    .refine((value) => !/\s{2,}/.test(value), {
      message: 'Consecutive spaces are not allowed',
    }),
});

export type TagSchemaType = z.infer<typeof tagSchema>;
