export interface FormatDateProps {
  date: Date;
  variant?: string;
}

export function formatDate({ date, variant }: FormatDateProps): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  if (variant === 'no-hours') {
    return `${day}.${month}.${year}`;
  } else {
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }
}

export function daysUntilStart(startDate: Date): number {
  const dateNow = new Date();
  dateNow.setHours(0, 0, 0, 0);
  return Math.floor(
    (startDate.getTime() - dateNow.getTime()) / (1000 * 60 * 60 * 24)
  );
}
