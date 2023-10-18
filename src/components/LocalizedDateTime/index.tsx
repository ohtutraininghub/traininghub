'use client';

/* 
  This component should be used if a localized date is wanted
  to be shown in an otherwise server-side-rendered component
*/

import { useEffect, useState } from 'react';
import {
  formatDateRangeShort,
  formatDateRangeWithTime,
  options,
} from '@/lib/timedateutils';

type DateConverterProps = DateRangeProps | SingleDateProps;

type DateRangeProps = {
  variant: 'range-short' | 'range-long';
  startDate: Date;
  endDate: Date;
};

type SingleDateProps = {
  variant: 'short' | 'long' | 'countDown';
  date: Date;
};

export default function LocalizedDateTime({
  variant,
  ...props
}: DateConverterProps) {
  const [dateString, setDateString] = useState('loading ...');

  useEffect(() => {
    if (['range-short', 'range-long'].includes(variant)) {
      const { startDate, endDate } = props as DateRangeProps;
      switch (variant) {
        case 'range-short':
          setDateString(formatDateRangeShort(startDate, endDate));
          break;
        case 'range-long':
          setDateString(formatDateRangeWithTime(startDate, endDate));
          break;
      }
    } else if (['short', 'long'].includes(variant)) {
      const { date } = props as SingleDateProps;
      switch (variant) {
        case 'short':
          setDateString(date.toDateString());
          break;
        case 'long':
          setDateString(date.toLocaleString([], options));
          break;
      }
    }
  }, []);

  return <>{dateString}</>;
}
