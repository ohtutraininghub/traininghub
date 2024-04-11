import z from 'zod';

export const exportStatsFormSchema = z.object({
  startDate: z.string().min(1).pipe(z.coerce.date()),
  endDate: z.string().min(1).pipe(z.coerce.date()),
});
export type ExportStatsFormType = z.infer<typeof exportStatsFormSchema>;
