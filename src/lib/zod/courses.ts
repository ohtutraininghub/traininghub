import z from 'zod';

const courseSchemaBase = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.string().min(1, 'Start date is required').pipe(z.coerce.date()),
  endDate: z.string().min(1, 'End date is required').pipe(z.coerce.date()),
  maxStudents: z.number().min(1, 'Max students is required'),
});

export const courseSchema = courseSchemaBase
  .strict()
  .refine(
    ({ startDate, endDate }) =>
      new Date(startDate).getTime() <= new Date(endDate).getTime(),
    {
      message: 'The end date cannot be before the start date',
      path: ['endDate'],
    }
  );

export const courseSchemaWithId = courseSchemaBase
  .merge(z.object({ id: z.string().min(1, 'Id is required') }))
  .strict()
  .refine(
    ({ startDate, endDate }) =>
      new Date(startDate).getTime() <= new Date(endDate).getTime(),
    {
      message: 'The end date cannot be before the start date',
      path: ['endDate'],
    }
  );

export type CourseSchemaType = z.infer<typeof courseSchema>;
export type CourseSchemaWithIdType = z.infer<typeof courseSchemaWithId>;
