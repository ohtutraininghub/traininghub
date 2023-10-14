import z from 'zod';

const withRefine = <O extends CourseSchemaType, T extends z.ZodTypeDef, I>(
  schema: z.ZodType<O, T, I>
) => {
  return schema.refine(
    (course) =>
      new Date(course.startDate).getTime() <=
      new Date(course.endDate).getTime(),
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
      .pipe(z.coerce.date()),
    endDate: z.string().min(1, 'End date is required').pipe(z.coerce.date()),
    maxStudents: z.number().min(1, 'Max students is required'),
  })
  .strict();

const courseSchemaBaseWithId = courseSchemaBase.extend({
  id: z.string().min(1, 'Id is required'),
});

export const courseSchema = withRefine(courseSchemaBase);
export const courseSchemaWithId = withRefine(courseSchemaBaseWithId);

export type CourseSchemaType = z.infer<typeof courseSchemaBase>;
export type CourseSchemaWithIdType = z.infer<typeof courseSchemaBaseWithId>;

export const courseSignupSchema = z.string(
  z.string().min(1, 'Course id is required')
);

export type CourseSignupSchemaType = z.infer<typeof courseSignupSchema>;
