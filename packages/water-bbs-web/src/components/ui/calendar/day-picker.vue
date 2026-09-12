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
} from 'reka-ui';
import { computed, watch } from 'vue';
import { useContext } from './context';

const { setCalenderDate, calendarDate, setMode } = useContext();

const date = calendarDate.value;
const currentMonth = computed(() => calendarDate.value.month);
const currentYear = computed(() => calendarDate.value.year);

watch(() => date, () => {
  setCalenderDate(date);
}, { deep: true });
</script>

<template>
  <calendar-root
    v-slot="{ weekDays, grid }"
    v-model="date"
    fixed-weeks
    class="rounded-xl p-4 bg-surface-100 border border-surface-200"
    :default-value="date"
  >
    <calendar-header>
      <calendar-prev>
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
      <calendar-next>
        <div class="size-4 icon-[flat-color-icons--next]" />
      </calendar-next>
    </calendar-header>
    <div class="w-full">
      <calendar-grid v-for="month in grid" :key="month.value.toString()">
        <calendar-grid-head>
          <calendar-grid-row>
            <calendar-head-cell v-for="day in weekDays" :key="day">
              {{ day }}
            </calendar-head-cell>
          </calendar-grid-row>
        </calendar-grid-head>
        <calendar-grid-body class="grid">
          <calendar-grid-row
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            class="grid grid-cols-7"
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
                class="relative flex items-center justify-center rounded-full whitespace-nowrap text-sm font-normal text-black w-8 h-8 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[outside-view]:text-black/30 data-[selected]:!bg-green10 data-[selected]:text-white hover:bg-green5 data-[highlighted]:bg-green5 data-[unavailable]:pointer-events-none data-[unavailable]:text-black/30 data-[unavailable]:line-through before:absolute before:top-[5px] before:hidden before:rounded-full before:w-1 before:h-1 before:bg-white data-[today]:before:block data-[today]:before:bg-green9 "
              />
            </calendar-cell>
          </calendar-grid-row>
        </calendar-grid-body>
      </calendar-grid>
    </div>
  </calendar-root>
</template>
