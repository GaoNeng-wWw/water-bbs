<script lang="ts" setup>
import { UiButton } from '@/components/ui';
import {
  MonthPickerCell,
  MonthPickerCellTrigger,
  MonthPickerGrid,
  MonthPickerGridBody,
  MonthPickerGridRow,
  MonthPickerHeader,
  MonthPickerHeading,
  MonthPickerNext,
  MonthPickerPrev,
  MonthPickerRoot,
} from 'reka-ui';
import { useContext } from './context';
import { computed, watch } from 'vue';

const { calendarDate, setCalenderDate, setMode } = useContext();

const date = calendarDate.value;
const currentMonth = computed(() => calendarDate.value.month);
const currentYear = computed(() => calendarDate.value.year);

watch(currentMonth, () => {
  setMode('day');
});

watch(() => date, () => {
  setCalenderDate(date);
}, { deep: true });
</script>

<template>
  <month-picker-root v-slot="{ grid }" v-model="date">
    <month-picker-header>
      <month-picker-prev>
        <div class="size-4 icon-[flat-color-icons--previous]" />
      </month-picker-prev>
      <month-picker-heading class="text-sm text-surface-fg font-medium">
        <ui-button variant="ghost" size="sm" @click="() => setMode('month')">
          {{ currentMonth }}
        </ui-button>
        <ui-button variant="ghost" size="sm" @click="() => setMode('year')">
          {{ currentYear }}
        </ui-button>
      </month-picker-heading>
      <month-picker-next>
        <div class="size-4 icon-[flat-color-icons--next]" />
      </month-picker-next>
    </month-picker-header>
    <month-picker-grid>
      <month-picker-grid-body>
        <month-picker-grid-row v-for="(months, index) in grid.rows" :key="`month-${index}`">
          <month-picker-cell
            v-for="month of months"
            :key="month.toString()"
            :date="month"
          >
            <month-picker-cell-trigger :month="month" />
          </month-picker-cell>
        </month-picker-grid-row>
      </month-picker-grid-body>
    </month-picker-grid>
  </month-picker-root>
</template>
