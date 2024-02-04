import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

export const templateSchema = z
  .object({
    name: z.string().min(1),
    description: z
      .string()
      .min(1)
      .transform((desc) => DOMPurify.sanitize(desc)),
    image: z.union([z.string().url().nullish(), z.literal('')]),
    maxStudents: z.number().min(1),
    tags: z.array(z.string().min(1)),
    summary: z.string().max(150).nullish(),
  })
  .strict();

export const templateSchemaWithId = templateSchema.extend({
  id: z.string().min(1),
  createdById: z.string(),
});

export const templateDeleteSchema = z
  .object({
    templateId: z.string().cuid(),
  })
  .strict();
