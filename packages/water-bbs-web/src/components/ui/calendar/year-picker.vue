<script setup lang="ts">
import { YearPickerCell, YearPickerCellTrigger, YearPickerGrid, YearPickerGridBody, YearPickerGridRow, YearPickerHeader, YearPickerHeading, YearPickerNext, YearPickerPrev, YearPickerRoot } from 'reka-ui';
import { useContext } from './context';
import { computed, watch } from 'vue';

const { calendarDate, setCalenderDate, setMode } = useContext();

const date = calendarDate.value;
const currentMonth = computed(() => calendarDate.value.month);
const currentYear = computed(() => calendarDate.value.year);

watch(currentYear, () => {
  setMode('month');
});

watch(() => date, () => {
  setCalenderDate(date);
});
</script>

<template>
  <year-picker-root
    v-slot="{ grid }"
    v-model="date"
    class="mt-6 rounded-xl bg-white p-4 shadow-sm border"
  >
    <year-picker-header class="flex items-center justify-between">
      <year-picker-prev
        class="inline-flex items-center cursor-pointer text-black justify-center rounded-md bg-transparent size-8 hover:bg-stone-50 active:scale-98 active:transition-all focus:shadow-[0_0_0_2px] focus:shadow-green10"
      >
        <div class="size-4 icon-[flat-color-icons--previous]" />
      </year-picker-prev>
      <year-picker-heading class="text-sm text-black font-medium">
        <ui-button variant="ghost" size="sm" @click="() => setMode('month')">
          {{ currentMonth }}
        </ui-button>
        <ui-button variant="ghost" size="sm" @click="() => setMode('year')">
          {{ currentYear }}
        </ui-button>
      </year-picker-heading>
      <year-picker-next
        class="inline-flex items-center cursor-pointer justify-center text-black rounded-md bg-transparent size-8 hover:bg-stone-50 active:scale-98 active:transition-all focus:shadow-[0_0_0_2px] focus:shadow-green10"
      >
        <div class="size-4 icon-[flat-color-icons--next]" />
      </year-picker-next>
    </year-picker-header>
    <div class="pt-4">
      <year-picker-grid class="w-full border-collapse select-none">
        <year-picker-grid-body class="grid gap-y-1">
          <year-picker-grid-row
            v-for="(years, index) in grid.rows"
            :key="`year-${index}`"
            class="grid grid-cols-4 gap-x-1"
          >
            <year-picker-cell
              v-for="year in years"
              :key="year.toString()"
              :date="year"
              class="relative text-center text-sm"
            >
              <year-picker-cell-trigger
                :year="year"
                class="relative flex items-center justify-center whitespace-nowrap text-sm font-normal text-black size-12 rounded-lg outline-none focus:shadow-[0_0_0_2px] focus:shadow-green10 data-[disabled]:text-black/30 data-[selected]:!bg-green10 data-[selected]:text-white hover:bg-green5 data-[unavailable]:pointer-events-none data-[unavailable]:text-black/30 data-[unavailable]:line-through before:absolute before:top-1 before:hidden before:rounded-full before:size-1 before:bg-white data-[today]:before:block data-[today]:before:bg-green9"
              />
            </year-picker-cell>
          </year-picker-grid-row>
        </year-picker-grid-body>
      </year-picker-grid>
    </div>
  </year-picker-root>
</template>
