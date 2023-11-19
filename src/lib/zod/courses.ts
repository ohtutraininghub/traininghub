import DOMPurify from 'isomorphic-dompurify';
import z from 'zod';

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
        message: 'The end date cannot be before the start date',
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
        message:
          'The last date to enroll cannot be after the end date of the course',
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
        message:
          'The last date to cancel enrollment cannot be after the end date of the course',
        path: ['lastCancelDate'],
      }
    );
};

const courseSchemaBase = z
  .object({
    name: z.string().min(1, 'Name is required'),
    description: z
      .string()
      .min(1, 'Description is required')
      .transform((desc) => DOMPurify.sanitize(desc)),
    startDate: z
      .string()
      .min(1, 'Start date is required')
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
          message: 'Start date cannot be in the past',
        }
      ),
    endDate: z.string().min(1, 'End date is required').pipe(z.coerce.date()),
    lastEnrollDate: z.preprocess(
      (value) => (!value ? null : value),
      z.coerce.date().nullable()
    ),
    lastCancelDate: z.preprocess(
      (value) => (!value ? null : value),
      z.coerce.date().nullable()
    ),
    maxStudents: z.number().min(1, 'Max students is required'),
    tags: z.array(z.string().min(1, 'Tag name cannot be empty')),
  })
  .strict();

const courseSchemaBaseWithId = courseSchemaBase.extend({
  id: z.string().min(1, 'Id is required'),
  createdById: z.string(),
});

export const courseSchema = withRefine(courseSchemaBase);
export const courseSchemaWithId = withRefine(courseSchemaBaseWithId);

export type CourseSchemaType = z.infer<typeof courseSchemaBase>;
export type CourseSchemaWithIdType = z.infer<typeof courseSchemaBaseWithId>;

export const courseEnrollSchema = z.string(
  z.string().min(1, 'Course id is required')
);

export type CourseEnrollSchemaType = z.infer<typeof courseEnrollSchema>;
