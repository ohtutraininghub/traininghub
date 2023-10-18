export const options = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  // timeZoneName: 'short',
} as Intl.DateTimeFormatOptions;

export const timeUntilstart = (startDate: Date): string => {
  const dateNow = Date.now();
  const asMs = startDate.getTime() - dateNow;
  const asMinutes = asMs / (1000 * 60);
  const asHours = asMinutes / 60;
  const asDays = asHours / 24;

  if (asDays >= 1) {
    return `Starts in ${Math.floor(asDays)} ${
      Math.floor(asDays) === 1 ? 'day' : 'days'
    }`;
  } else if (asMinutes >= 60) {
    return `Starts in ${Math.floor(asHours)} ${
      Math.floor(asHours) === 1 ? 'hour' : 'hours'
    }`;
  } else {
    return `Starts in ${Math.floor(asMinutes)} ${
      Math.floor(asMinutes) === 1 ? 'minute' : 'minutes'
    }`;
  }
};

export const formatDateRangeShort = (startDate: Date, endDate: Date) => {
  return `${startDate.toDateString()} - ${endDate.toDateString()}`;
};

export const formatDateRangeWithTime = (startDate: Date, endDate: Date) => {
  return `${startDate.toLocaleString([], options)} - ${endDate.toLocaleString(
    [],
    options
  )}`;
};
