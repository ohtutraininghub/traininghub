import z from 'zod';
import { zodI18nMap } from 'zod-i18n-map';
import { makeZodI18nMap } from 'zod-i18n-map';

z.setErrorMap(zodI18nMap);
z.setErrorMap(makeZodI18nMap({ ns: ['zod', 'custom'] }));

export const maxTitleLength = 56;

export const titleSchema = z.object({
  name: z
    .string()
    .refine((value) => value.trim() !== '', {
      params: {
        i18n: { key: 'titleNameRequired' },
      },
    })
    .refine((value) => value.trim().length <= maxTitleLength, {
      params: {
        i18n: { key: 'maximumLengthForTitleIs', values: { maxTitleLength } },
      },
    })
    .refine((value) => !/\s{2,}/.test(value), {
      params: {
        i18n: { key: 'consecutiveSpacesNotAllowed' },
      },
    }),
});

export const titleDeleteSchema = z
  .object({
    titleId: z.string().cuid(),
  })
  .strict();

export type TitleSchemaType = z.infer<typeof titleSchema>;

export type TitleDeleteSchemaType = z.infer<typeof titleDeleteSchema>;
