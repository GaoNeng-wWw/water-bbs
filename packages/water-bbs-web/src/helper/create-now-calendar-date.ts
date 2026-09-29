import { createCalendarDate } from './create-calendar-date';

export const createNowCalendarDate = () => {
  const now = new Date();
  return createCalendarDate(now);
};
