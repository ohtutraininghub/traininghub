'use client';

type DateConverterProps = DateRangeProps | SingleDateProps;

type DateRangeProps = {
  variant: 'range-short' | 'range-long';
  startDate: Date;
  endDate: Date;
};

type SingleDateProps = {
  variant: 'short' | 'long';
  date: Date;
};

const options = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
} as Intl.DateTimeFormatOptions;

export default function LocalizedDateTime({
  variant,
  ...props
}: DateConverterProps) {
  let dateString;

  switch (variant) {
    case 'range-short':
    case 'range-long':
      const { startDate, endDate } = props as DateRangeProps;
      variant === 'range-short'
        ? (dateString = `${startDate.toDateString()} - ${endDate.toDateString()}`)
        : (dateString = `${startDate.toLocaleString(
            [],
            options
          )} - ${endDate.toLocaleString([], options)}`);
      console.log(endDate.toDateString());
      break;

    case 'short':
    case 'long':
      const { date } = props as SingleDateProps;
      variant === 'short'
        ? (dateString = date.toDateString())
        : (dateString = date.toLocaleString([], options));
      break;
  }

  return <>{dateString}</>;
}
