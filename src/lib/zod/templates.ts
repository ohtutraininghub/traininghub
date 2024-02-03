import { z } from 'zod';

export const templateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export const templateSchemaWithId = templateSchema.extend({
  id: z.string().min(1),
});

export const templateSchemaWithCreatorId = templateSchema.extend({
  cretedById: z.string().min(1),
});

export const templateDeleteSchema = z
  .object({
    templateId: z.string().cuid(),
  })
  .strict();
