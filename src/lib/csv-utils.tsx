type CoursesForCsv = {
  name: string;
  createdBy: { name: string };
  students: Array<{
    name?: string | null;
    country?: { name: string } | null;
    title?: { name: string } | null;
  }>;
  startDate: string;
  endDate: string;
};

export function DownloadTrainingSessionsAsCSV(
  fromDate: Date,
  toDate: Date,
  courses: CoursesForCsv[]
) {
  const csvHeader =
    'Training Name,Trainer Name,Participant Name,Country,Title,Start Date, End Date\n';

  const csvContent = courses
    .flatMap((course) => {
      return course.students.map((student) => {
        return [
          course.name,
          course.createdBy.name,
          student.name,
          student.country?.name ?? '',
          student.title?.name ?? '',
          course.startDate.slice(0, 10),
          course.endDate.slice(0, 10),
        ].join(',');
      });
    })
    .join('\n');
  const csv = csvHeader + csvContent;

  // Trigger download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const file_name = `training-data_${fromDate
    .toISOString()
    .slice(0, 10)}_${toDate.toISOString().slice(0, 10)}.csv`;
  link.setAttribute('download', file_name);
  document.body.appendChild(link); // Required for Firefox
  link.click();
  document.body.removeChild(link); // Cleanup
}
