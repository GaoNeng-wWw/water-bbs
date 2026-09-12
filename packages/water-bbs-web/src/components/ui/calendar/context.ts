import { createContext } from '@/composables';
import type { DateValue } from '@internationalized/date';
import type { ComputedRef } from 'vue';

export type CalendarMode = 'day' | 'month' | 'year';

export type CalendarContext = {
  calendarDate: ComputedRef<DateValue>;
  setCalenderDate: (date: DateValue) => void;
  mode: ComputedRef<CalendarMode>;
  setMode: (mode: CalendarMode) => void;
};

export const [provideContext, useContext] = createContext<CalendarContext>('calendar');
