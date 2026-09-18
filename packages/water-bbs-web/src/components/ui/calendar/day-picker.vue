<script setup lang="ts">
import calendarToolbar from './calendar-toolbar.vue';
import { Icon } from '@iconify/vue';
import { CalendarCell, CalendarCellTrigger, CalendarGrid, CalendarGridBody, CalendarGridHead, CalendarGridRow, CalendarHeadCell, CalendarHeader, CalendarHeading, CalendarNext, CalendarPrev, CalendarRoot } from 'reka-ui';
import { useContext } from './context';

const { currentDate, placeholder } = useContext();
</script>

<template>
  <calendar-root
    v-slot="{ weekDays, grid }"
    v-model:placeholder="placeholder"
    :default-value="currentDate"
    class="rounded-xl bg-surface-50 p-4"
    fixed-weeks
    prevent-deselect
  >
    <calendar-header class="flex items-center justify-between">
      <calendar-prev
        class="
        text-surface-fg
        inline-flex items-center cursor-pointer justify-center rounded-md bg-transparent
        size-6 hover:bg-surface-100 active:scale-98 active:transition-all"
      >
        <icon
          icon="radix-icons:chevron-left"
          class="w-4 h-4"
        />
      </calendar-prev>
      <calendar-heading class="text-sm font-medium flex">
        <calendar-toolbar />
      </calendar-heading>

      <calendar-next
        class="
        text-surface-fg
        inline-flex items-center cursor-pointer justify-center rounded-md bg-transparent
        size-6 hover:bg-surface-100 active:scale-98 active:transition-all
        "
      >
        <icon
          icon="radix-icons:chevron-right"
          class="w-4 h-4"
        />
      </calendar-next>
    </calendar-header>
    <div
      class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
    >
      <calendar-grid
        v-for="month in grid"
        :key="month.value.toString()"
        class="w-full border-collapse select-none space-y-1"
      >
        <calendar-grid-head>
          <calendar-grid-row class="mb-1 grid w-full grid-cols-7">
            <calendar-head-cell
              v-for="day in weekDays"
              :key="day"
              class="rounded-md text-xs text-surface-fg/50"
            >
              {{ day }}
            </calendar-head-cell>
          </calendar-grid-row>
        </calendar-grid-head>
        <calendar-grid-body class="grid">
          <calendar-grid-row
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            class="grid grid-cols-7 space-y-2"
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
                mx-auto
                relative flex items-center justify-center rounded-full whitespace-nowrap text-sm font-normal
                text-surface-fg w-8 h-8 outline-none cursor-pointer
                data-outside-view:text-surface-fg/30
                data-selected:bg-primary/20 data-selected:text-surface-fg
                hover:bg-primary/20
                data-highlighted:bg-primary/20
                data-unavailable:pointer-events-none
                data-unavailable:text-surface-fg/30
                data-unavailable:line-through
                before:absolute before:top-1.25 before:hidden before:rounded-full before:w-1 before:h-1
                data-today:before:block data-today:before:bg-primary-500
              "
              />
            </calendar-cell>
          </calendar-grid-row>
        </calendar-grid-body>
      </calendar-grid>
    </div>
  </calendar-root>
</template>
