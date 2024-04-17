import z from 'zod';

export const exportStatsFormSchema = z.object({
  fromDate: z.string().min(1).pipe(z.coerce.date()),
  toDate: z.string().min(1).pipe(z.coerce.date()),
});
export type ExportStatsFormType = z.infer<typeof exportStatsFormSchema>;
