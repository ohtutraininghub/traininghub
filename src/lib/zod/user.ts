import z from 'zod';
import { zodI18nMap } from 'zod-i18n-map';
import { makeZodI18nMap } from 'zod-i18n-map';

z.setErrorMap(zodI18nMap);
z.setErrorMap(makeZodI18nMap({ ns: ['zod', 'custom'] }));

export const userInfoSchema = z.object({
  country: z.string().refine((value) => value.trim() !== '', {
    params: {
      i18n: { key: 'countryRequired' },
    },
  }),
  title: z.string().refine((value) => value.trim() !== '', {
    params: {
      i18n: { key: 'titleRequired' },
    },
  }),
});

export type UserInfoSchemaType = z.infer<typeof userInfoSchema>;
