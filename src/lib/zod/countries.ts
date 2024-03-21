import z from 'zod';
import { zodI18nMap } from 'zod-i18n-map';
import { makeZodI18nMap } from 'zod-i18n-map';

z.setErrorMap(zodI18nMap);
z.setErrorMap(makeZodI18nMap({ ns: ['zod', 'custom'] }));

export const maxCountryLength = 60;

export const countrySchema = z.object({
  name: z
    .string()
    .refine((value) => value.trim() !== '', {
      params: {
        i18n: { key: 'tagNameRequired' },
      },
    })
    .refine((value) => value.trim().length <= maxCountryLength, {
      params: {
        i18n: { key: 'maximumLengthForTagIs', values: { maxCountryLength } },
      },
    })
    .refine((value) => !/\s{2,}/.test(value), {
      params: {
        i18n: { key: 'consecutiveSpacesNotAllowed' },
      },
    }),
});

export const countryDeleteSchema = z
  .object({
    tagId: z.string().cuid(),
  })
  .strict();

export type CountrySchemaType = z.infer<typeof countrySchema>;

export type CountryDeleteSchemaType = z.infer<typeof countryDeleteSchema>;
