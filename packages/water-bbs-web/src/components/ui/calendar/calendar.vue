<script lang="ts" setup>
import { computed, ref, watch, type ComputedRef, type Ref } from 'vue';
import { provideContext, type Mode } from './context';
import type { DateValue } from 'reka-ui';
import { ConfigProvider } from 'reka-ui';
import { CalendarDate } from '@internationalized/date';
import MonthPick from './month-pick.vue';
import DayPicker from './day-picker.vue';
import YearPicker from './year-picker.vue';

const modelValue = defineModel<DateValue>({ required: true });

const date = computed(() => modelValue.value);
const currentDate = ref(
  date.value instanceof Date
    ? new CalendarDate(
      date.value.getFullYear(),
      date.value.getMonth() + 1,
      date.value.getDate() + 1,
    ) as DateValue
    : date.value,
);
const placeholder = ref(currentDate.value as DateValue) as Ref<DateValue>;
const mode = ref<Mode>('day');
const setMode = (newMode: Mode) => {
  mode.value = newMode;
};
const setDay = (value: DateValue) => {
  placeholder.value = value;
};
const setMonth = (value: DateValue) => {
  placeholder.value = value;
};
const setYear = (value: DateValue) => {
  placeholder.value = value;
};

watch(placeholder, () => {
  if (!placeholder.value) {
    return;
  }
  currentDate.value = placeholder.value as DateValue;
});
watch(currentDate, () => {
  if (modelValue.value !== undefined) {
    modelValue.value = currentDate.value as DateValue;
  }
});

provideContext({
  placeholder: placeholder,
  mode: computed(() => mode.value),
  setMode,
  setDay,
  setMonth,
  setYear,
  currentDate: computed(() => currentDate.value) as ComputedRef<DateValue>,
  toMonthView: () => {
    mode.value = 'month';
  },
  toYearView: () => {
    mode.value = 'year';
  },
  toDayView: () => {
    mode.value = 'day';
  },
});
</script>

<template>
  <div>
    <year-picker v-if="mode === 'year'" />
    <month-pick v-if="mode === 'month'" />
    <day-picker v-if="mode === 'day'" />
  </div>
</template>
