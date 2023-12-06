import DOMPurify from 'isomorphic-dompurify';
import z from 'zod';
import { zodI18nMap } from 'zod-i18n-map';
import { makeZodI18nMap } from 'zod-i18n-map';

z.setErrorMap(zodI18nMap);
z.setErrorMap(makeZodI18nMap({ ns: ['zod', 'custom'] }));

// The minimum time in milliseconds to course start
// at which cancelling enrollment is still allowed
export const minCancelTimeMs = 48 * 60 * 60 * 1000; // 48 hours

const withRefine = <O extends CourseSchemaType, T extends z.ZodTypeDef, I>(
  schema: z.ZodType<O, T, I>
) => {
  return schema
    .refine(
      ({ startDate, endDate }) => {
        // don't show this error if either of the date fields is still empty
        if (!startDate || !endDate) {
          return true;
        }
        return startDate.getTime() <= endDate.getTime();
      },
      {
        params: {
          i18n: { key: 'endDateCannotBeBeforeStartDate' },
        },
        path: ['endDate'],
      }
    )
    .refine(
      ({ endDate, lastEnrollDate }) => {
        // don't show error if course end date or last date to enroll is still empty
        if (!endDate || !lastEnrollDate) {
          return true;
        }
        return lastEnrollDate.getTime() < endDate.getTime();
      },
      {
        params: {
          i18n: { key: 'lastEnrollDateCannotBeAfterEndDate' },
        },
        path: ['lastEnrollDate'],
      }
    )
    .refine(
      ({ endDate, lastCancelDate }) => {
        // don't show error if course end date or last date to cancel is still empty
        if (!endDate || !lastCancelDate) {
          return true;
        }
        return lastCancelDate.getTime() < endDate.getTime();
      },
      {
        params: {
          i18n: { key: 'lastCancelEnrollDateCannotBeAfterEndDate' },
        },
        path: ['lastCancelDate'],
      }
    );
};

const courseSchemaBase = z
  .object({
    name: z.string().min(1),
    description: z
      .string()
      .min(1)
      .transform((desc) => DOMPurify.sanitize(desc)),
    startDate: z
      .string()
      .min(1)
      .pipe(z.coerce.date())
      .refine(
        (start) => {
          // avoid .refine trying to call .getTime on undefined when field is empty
          if (!start) {
            return true;
          }
          return start.getTime() > Date.now();
        },
        {
          params: {
            i18n: { key: 'startDateCannotBeInThePast' },
          },
        }
      ),
    endDate: z.string().min(1).pipe(z.coerce.date()),
    lastEnrollDate: z
      .string()
      .nullish()
      .transform((value) => (value ? value : null))
      .pipe(z.coerce.date().nullable()),
    lastCancelDate: z
      .string()
      .nullish()
      .transform((value) => (value ? value : null))
      .pipe(z.coerce.date().nullable()),
    maxStudents: z.number().min(1, 'Max students is required'),
    tags: z.array(z.string().min(1, 'Tag name cannot be empty')),
  })
  .strict();

const courseSchemaBaseWithId = courseSchemaBase.extend({
  id: z.string().min(1),
  createdById: z.string(),
});

export const courseSchema = withRefine(courseSchemaBase);
export const courseSchemaWithId = withRefine(courseSchemaBaseWithId);

export type CourseSchemaType = z.infer<typeof courseSchemaBase>;
export type CourseSchemaWithIdType = z.infer<typeof courseSchemaBaseWithId>;

export const courseEnrollSchema = z
  .object({
    courseId: z.string().min(1),
    insertToCalendar: z.boolean().nullish(),
  })
  .strict();

export type CourseEnrollSchemaType = z.infer<typeof courseEnrollSchema>;
