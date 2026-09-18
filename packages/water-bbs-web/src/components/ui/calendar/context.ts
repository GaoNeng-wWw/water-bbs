import { createContext } from '@/composables';
import type { DateValue } from 'reka-ui';
import type { ComputedRef, Ref } from 'vue';

export type Setter = (value: DateValue) => void;
export type Mode = 'year' | 'month' | 'day';
export type CalendarContext = {
  placeholder: Ref<DateValue>;
  mode: ComputedRef<Mode>;
  setMode: (mode: Mode) => void;
  currentDate: ComputedRef<DateValue>;
  setDay: Setter;
  setMonth: Setter;
  setYear: Setter;
  toMonthView: () => void;
  toYearView: () => void;
  toDayView: () => void;
};

export const [provideContext, useContext] = createContext<CalendarContext>('Calendar');
