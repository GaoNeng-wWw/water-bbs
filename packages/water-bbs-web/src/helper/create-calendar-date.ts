import { CalendarDate, type DateValue } from '@internationalized/date';

export const createCalendarDate = (date: Date | string | DateValue): DateValue => {
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate() + 1;
    return new CalendarDate(year, month, day);
  }
  if (typeof date === 'string') {
    return createCalendarDate(new Date(date));
  }
  return date;
};
