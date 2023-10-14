import z from 'zod';

const courseSchemaObject = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.string().min(1, 'Start date is required').pipe(z.coerce.date()),
  endDate: z.string().min(1, 'End date is required').pipe(z.coerce.date()),
  maxStudents: z.number().min(1, 'Max students is required'),
});

const courseSchemaObjectWithId = courseSchemaObject.extend({
  id: z.string().min(1, 'Id is required'),
});

const withRefine = (schema: typeof courseSchemaObject) => {
  return schema
    .strict()
    .refine(
      ({ startDate, endDate }) =>
        new Date(startDate).getTime() <= new Date(endDate).getTime(),
      {
        message: 'The end date cannot be before the start date',
        path: ['endDate'],
      }
    );
};

export const courseSchema = withRefine(courseSchemaObject);
export const courseSchemaWithId = withRefine(courseSchemaObjectWithId);

export type CourseSchemaType = z.infer<typeof courseSchemaObject>;
export type CourseSchemaWithIdType = z.infer<typeof courseSchemaObjectWithId>;

export const courseSignupSchema = z.string(
  z.string().min(1, 'Course id is required')
);

export type CourseSignupSchemaType = z.infer<typeof courseSignupSchema>;
