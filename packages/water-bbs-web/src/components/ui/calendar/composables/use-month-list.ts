type MonthFormat = 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
export type UseMonthListProps = {
  locals?: string[];
  format: MonthFormat;

};
export const useMonthList = (
  { locals, format }: UseMonthListProps,
) => {
  const fmt = Intl.DateTimeFormat(locals, { month: format, timeZone: 'UTC' });
  return Array.from({ length: 12 }, (_, i) => {
    return fmt.format(new Date(Date.UTC(1990, i, 1)));
  });
};
