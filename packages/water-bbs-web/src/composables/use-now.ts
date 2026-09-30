import { CalendarDate } from '@internationalized/date';
export const useNow = () => {
  const nowDate = new Date();
  const nowDateValue = new CalendarDate(
    nowDate.getFullYear(),
    nowDate.getMonth() + 1,
    nowDate.getDate(),
  );
  return { nowDate, nowDateValue };
};
