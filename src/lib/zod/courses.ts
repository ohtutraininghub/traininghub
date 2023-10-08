import z from 'zod';

export const courseSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
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
    maxStudents: z.number().min(1, 'Max students is required'),
    tags: z.array(z.string().min(1, 'Tag name cannot be empty')),
  })
  .strict()
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
  );

export type CourseSchemaType = z.infer<typeof courseSchema>;
