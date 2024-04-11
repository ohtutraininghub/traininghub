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

// Function to convert data to CSV and trigger download
export function DownloadTrainingSessionsAsCSV(sessions: TrainingSession[]) {
  // Convert data to CSV string
  const csvContent = sessions
    .map((session) => {
      const participantDetails = session.participants
        .map(
          (participant) =>
            `${participant.name},${participant.country},${participant.title}`
        )
        .join('\n');

      return [
        session.trainingName,
        session.trainerName,
        participantDetails,
        session.date,
      ].join(',');
    })
    .join('\n');

  const csvHeader = 'Training Name,Trainer Name,Participant Details,Date\n';
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
