<script lang="ts" setup>
import { UiButton } from '@/components/ui';
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
  type DateValue,
} from 'reka-ui';
import { computed, ref, watch } from 'vue';
import { useContext } from './context';

const { setCalenderDate, calendarDate, setMode } = useContext();

const date = ref<DateValue>(calendarDate.value);
const currentMonth = computed(() => calendarDate.value.month);
const currentYear = computed(() => calendarDate.value.year);

watch(() => date, () => {
  setCalenderDate(date.value as DateValue);
}, { deep: true });
</script>

<template>
  <calendar-root
    v-slot="{ weekDays, grid }"
    v-model="date"
    fixed-weeks
    class="rounded-xl p-4 bg-surface-100 border border-surface-200"
  >
    <calendar-header class="flex w-full justify-between">
      <calendar-prev class="cursor-pointer">
        <div class="size-4 icon-[flat-color-icons--previous]" />
      </calendar-prev>
      <calendar-heading class="text-sm text-surface-fg font-medium">
        <ui-button variant="ghost" size="sm" @click="() => setMode('month')">
          {{ currentMonth }}
        </ui-button>
        <ui-button variant="ghost" size="sm" @click="() => setMode('year')">
          {{ currentYear }}
        </ui-button>
      </calendar-heading>
      <calendar-next class="cursor-pointer">
        <div class="size-4 icon-[flat-color-icons--next]" />
      </calendar-next>
    </calendar-header>
    <div class="w-full">
      <calendar-grid v-for="month in grid" :key="month.value.toString()" class="w-full">
        <calendar-grid-head>
          <calendar-grid-row class="grid grid-cols-7">
            <calendar-head-cell v-for="day in weekDays" :key="day" class="text-surface-fg">
              {{ day }}
            </calendar-head-cell>
          </calendar-grid-row>
        </calendar-grid-head>
        <calendar-grid-body class="w-full">
          <calendar-grid-row
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            class="w-full grid grid-cols-7 text-surface-fg"
          >
            <calendar-cell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              class="relative text-center text-sm"
            >
              <calendar-cell-trigger
                :day="weekDate"
                :month="month.value"
                class="
                  cursor-pointer
                  relative flex items-center justify-center rounded-full whitespace-nowrap text-sm font-normal text-surface-fg
                  w-8 h-8 outline-none
                  data-outside-view:text-surface-fg/30 data-selected:bg-primary/20! data-selected:text-white
                  data-highlighted:bg-primary/20 data-unavailable:pointer-events-none
                  data-unavailable:text-surface-fg/30 data-unavailable:line-through
                  before:top-1.25
                  data-today:before:block data-today:before:bg-primary-500
                  hover:bg-green5  before:absolute  before:hidden before:rounded-full before:w-1 before:h-1 before:bg-white"
              />
            </calendar-cell>
          </calendar-grid-row>
        </calendar-grid-body>
      </calendar-grid>
    </div>
  </calendar-root>
</template>
