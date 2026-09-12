<script lang="ts" setup>
import { CalendarDate, type DateValue } from '@internationalized/date';
import { computed, ref } from 'vue';
import { provideContext, type CalendarMode } from './context';
import DayPicker from './day-picker.vue';
import MonthPicker from './month-picker.vue';
import YearPicker from './year-picker.vue';
const modelValue = defineModel<string | Date>({ default: () => new Date() });

const date = computed(() => modelValue.value instanceof Date ? modelValue.value : new Date(modelValue.value));
const calendarDate = ref<DateValue>(new CalendarDate(
  date.value.getFullYear(),
  date.value.getMonth() + 1,
  date.value.getDate(),
));
const setCalenderDate = (date: DateValue) => {
  calendarDate.value = new CalendarDate(date.year, date.month, date.day);
};
const mode = ref<CalendarMode>('day');

const setMode = (newMode: CalendarMode) => {
  mode.value = newMode;
};

provideContext({
  setCalenderDate,
  calendarDate: computed(() => calendarDate.value as DateValue),
  mode: computed(() => mode.value),
  setMode,
});
</script>

<template>
  <div class="w-full">
    <day-picker v-if="mode === 'day'" />
    <month-picker v-if="mode === 'month'" />
    <year-picker v-if="mode === 'year'" />
  </div>
</template>
