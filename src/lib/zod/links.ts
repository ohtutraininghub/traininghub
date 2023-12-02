import z from 'zod';

export const linkSchema = z
  .string()
  .url({ message: 'Please enter a valid URL!' });

export type LinkSchemaType = z.infer<typeof linkSchema>;
