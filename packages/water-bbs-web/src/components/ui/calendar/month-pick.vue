<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { useContext } from './context';
import { MonthPickerCell, MonthPickerCellTrigger, MonthPickerGrid, MonthPickerGridBody, MonthPickerGridRow, MonthPickerHeader, MonthPickerHeading, MonthPickerNext, MonthPickerPrev, MonthPickerRoot, type DateValue } from 'reka-ui';
import CalendarToolbar from './calendar-toolbar.vue';
import { nextTick, onUnmounted, ref, watch, type Ref } from 'vue';

const { placeholder, currentDate, toDayView } = useContext();
const modelValue = ref(currentDate.value) as Ref<DateValue>;
const stop = watch(modelValue, () => {
  nextTick(() => {
    toDayView();
  });
}, { deep: true });
onUnmounted(stop);
</script>

<template>
  <month-picker-root
    v-slot="{ grid }"
    v-model:placeholder="placeholder"
    v-model="modelValue"
    :default-value="currentDate"
    class="rounded-xl bg-surface-50 p-4"
  >
    <month-picker-header class="flex items-center justify-between">
      <month-picker-prev
        class="
        text-surface-fg
        inline-flex items-center cursor-pointer justify-center rounded-md bg-transparent
        size-6 hover:bg-surface-100 active:scale-98 active:transition-all"
      >
        <icon icon="radix-icons:chevron-left" class="size-4" />
      </month-picker-prev>
      <month-picker-heading class="text-sm text-black font-medium">
        <calendar-toolbar />
      </month-picker-heading>
      <month-picker-next
        class="
        text-surface-fg
        inline-flex items-center cursor-pointer justify-center rounded-md bg-transparent
        size-6 hover:bg-surface-100 active:scale-98 active:transition-all"
      >
        <icon icon="radix-icons:chevron-right" class="size-4" />
      </month-picker-next>
    </month-picker-header>
    <div class="pt-4">
      <month-picker-grid class="w-full border-collapse select-none">
        <month-picker-grid-body class="grid gap-y-1">
          <month-picker-grid-row
            v-for="(months, index) in grid.rows" :key="`month-${index}`"
            class="grid grid-cols-4 gap-x-1"
          >
            <month-picker-cell
              v-for="month in months" :key="month.toString()" :date="month"
              class="relative text-center text-sm"
            >
              <month-picker-cell-trigger
                :month="month"
                class="
                relative flex items-center justify-center whitespace-nowrap text-sm font-normal
                text-surface-fg size-12 rounded-lg outline-none cursor-pointer
                data-disabled:text-surface-fg/30 data-selected:bg-surface-200! data-selected:text-surfaec-fg
                hover:bg-surface-200 data-unavailable:pointer-events-none
                data-unavailable:text-surface-fg/30 data-unavailable:line-through before:absolute before:top-1 before:hidden before:rounded-full before:size-1
                before:bg-white data-today:before:block data-today:before:bg-primary"
              />
            </month-picker-cell>
          </month-picker-grid-row>
        </month-picker-grid-body>
      </month-picker-grid>
    </div>
  </month-picker-root>
</template>
