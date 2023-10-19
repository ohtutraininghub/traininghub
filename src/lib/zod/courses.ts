import z from 'zod';

const withRefine = <O extends CourseSchemaType, T extends z.ZodTypeDef, I>(
  schema: z.ZodType<O, T, I>
) => {
  return schema.refine(
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
};

const courseSchemaBase = z
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
  .strict();

const courseSchemaBaseWithId = courseSchemaBase.extend({
  id: z.string().min(1, 'Id is required'),
});

export const courseSchema = withRefine(courseSchemaBase);
export const courseSchemaWithId = withRefine(courseSchemaBaseWithId);

export type CourseSchemaType = z.infer<typeof courseSchemaBase>;
export type CourseSchemaWithIdType = z.infer<typeof courseSchemaBaseWithId>;

export const courseEnrollSchema = z.string(
  z.string().min(1, 'Course id is required')
);

export type CourseEnrollSchemaType = z.infer<typeof courseEnrollSchema>;
