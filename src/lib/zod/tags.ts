import z from 'zod';
import { zodI18nMap } from 'zod-i18n-map';
import { makeZodI18nMap } from 'zod-i18n-map';

z.setErrorMap(zodI18nMap);
z.setErrorMap(makeZodI18nMap({ ns: ['zod', 'custom'] }));

export const maxTagLength = 50;

export const tagSchema = z.object({
  name: z
    .string()
    .refine((value) => value.trim() !== '', {
      params: {
        i18n: { key: 'tagNameRequired' },
      },
    })
    .refine((value) => value.trim().length <= maxTagLength, {
      params: {
        i18n: { key: 'maximumLengthForTagIs', values: { maxTagLength } },
      },
    })
    .refine((value) => !/\s{2,}/.test(value), {
      params: {
        i18n: { key: 'consecutiveSpacesNotAllowed' },
      },
    }),
});

export const tagDeleteSchema = z
  .object({
    tagId: z.string().cuid(),
  })
  .strict();

export type TagSchemaType = z.infer<typeof tagSchema>;

export type TagDeleteSchemaType = z.infer<typeof tagDeleteSchema>;
