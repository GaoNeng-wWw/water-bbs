<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { YearPickerCell, YearPickerCellTrigger, YearPickerGrid, YearPickerGridBody, YearPickerGridRow, YearPickerHeader, YearPickerHeading, YearPickerNext, YearPickerPrev, YearPickerRoot, type DateValue } from 'reka-ui';
import { useContext } from './context';
import CalendarToolbar from './calendar-toolbar.vue';
import { nextTick, onUnmounted, ref, watch, type Ref, type WatchHandle } from 'vue';

const { placeholder, currentDate, toMonthView } = useContext();
const modelValue = ref(currentDate.value) as Ref<DateValue>;
const stop = watch(modelValue, () => {
  nextTick(() => {
    toMonthView();
  });
}, { deep: true });
onUnmounted(stop);
</script>

<template>
  <year-picker-root
    v-slot="{ grid }"
    v-model:placeholder="placeholder"
    v-model="modelValue"
    :default-value="currentDate"
    class="rounded-xl bg-surface-50 p-4"
  >
    <year-picker-header class="flex items-center justify-between">
      <year-picker-prev
        class="
        text-surface-fg
        inline-flex items-center cursor-pointer justify-center rounded-md bg-transparent
        size-6 hover:bg-surface-100 active:scale-98 active:transition-all"
      >
        <icon icon="radix-icons:chevron-left" class="size-4" />
      </year-picker-prev>
      <year-picker-heading class="text-sm text-black font-medium">
        <calendar-toolbar />
      </year-picker-heading>
      <year-picker-next
        class="
        text-surface-fg
        inline-flex items-center cursor-pointer justify-center rounded-md bg-transparent
        size-6 hover:bg-surface-100 active:scale-98 active:transition-all"
      >
        <icon icon="radix-icons:chevron-right" class="size-4" />
      </year-picker-next>
    </year-picker-header>
    <div class="pt-4">
      <year-picker-grid class="w-full border-collapse select-none">
        <year-picker-grid-body class="grid gap-y-1">
          <year-picker-grid-row
            v-for="(years, index) in grid.rows" :key="`year-${index}`"
            class="grid grid-cols-4 gap-x-1"
          >
            <year-picker-cell
              v-for="year in years" :key="year.toString()" :date="year"
              class="relative text-center text-sm"
            >
              <year-picker-cell-trigger
                :year="year"
                class="
                relative flex items-center justify-center whitespace-nowrap text-sm font-normal w-fit p-2
                text-surface-fg size-12 rounded-lg outline-none cursor-pointer
                data-disabled:text-surface-fg/30 data-selected:bg-surface-200! data-selected:text-surfaec-fg
                hover:bg-surface-200 data-unavailable:pointer-events-none
                data-unavailable:text-surface-fg/30 data-unavailable:line-through before:absolute before:top-1 before:hidden before:rounded-full before:size-1
                before:bg-white data-today:before:block data-today:before:bg-primary"
              />
            </year-picker-cell>
          </year-picker-grid-row>
        </year-picker-grid-body>
      </year-picker-grid>
    </div>
  </year-picker-root>
</template>
