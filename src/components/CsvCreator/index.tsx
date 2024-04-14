type TrainingSession = {
  trainingName: string;
  trainerName: string;
  participants: Array<{
    name: string;
    country: string;
    title: string;
  }>;
  date: string;
};

export function DownloadTrainingSessionsAsCSV(sessions: TrainingSession[]) {
  const csvHeader =
    'Training Name,Trainer Name,Participant Name,Country,Title,Date\n';

  const csvContent = sessions
    .flatMap((session) => {
      return session.participants.map((participant) => {
        return [
          session.trainingName,
          session.trainerName,
          participant.name,
          participant.country,
          participant.title,
          session.date,
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
  link.setAttribute('download', 'training_sessions.csv');
  document.body.appendChild(link); // Required for Firefox
  link.click();
  document.body.removeChild(link); // Cleanup
}
