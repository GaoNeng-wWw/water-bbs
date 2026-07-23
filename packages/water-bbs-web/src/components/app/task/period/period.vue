<script lang="ts" setup>
import { PeriodUnit, type PeriodModelValue } from './period.props';
import { UiSelect, UiNumeric } from '@/components/ui';

const unit = ['Once', 'day', 'week', 'month', 'year']
  .map((value) => {
    return { label: value, value };
  });

const modelValue = defineModel<PeriodModelValue>({
  default: () => {
    return {
      unit: PeriodUnit.Day,
      value: 1,
    };
  },
});
</script>

<template>
  <div class="w-full flex gap-4">
    <div v-if="modelValue.unit !== PeriodUnit.Once" class="shrink-0 w-fit">
      <ui-numeric v-model="modelValue.value" fit />
    </div>
    <ui-select v-model="modelValue.unit" :options="unit" class="w-fit" fit />
  </div>
</template>
