<script lang="ts" setup>
import { Layout, UiButton } from '@/components/ui';
import { Condition, Period, PeriodUnit } from '@/components/app/task';
import { reactive } from 'vue';

const formData = reactive({
  condition: {},
  period: {
    unit: PeriodUnit.Once,
    value: 1,
  },
});
</script>

<template>
  <layout>
    <template #header>
      <div class="max-w-[1200px] mx-auto w-full grow">
        <home-header />
      </div>
    </template>
    <div class="max-w-1200px mx-auto size-full grow flex flex-col py-4">
      <div class="mb-4">
        <ui-button icon color="primary" rounded="lg">
          <div class="i-material-symbols:arrow-back-ios-new-rounded size-4" />
        </ui-button>
      </div>
      <div class="w-full flex flex-col gap-4">
        <div class="px-1">
          <h2 class="text-warm-foreground text-2xl mb-2">
            Condition
          </h2>
          <condition />
        </div>
        <div class="px-1">
          <h2 class="text-warm-foreground text-2xl mb-2">
            Period
          </h2>
          <period v-model="formData.period" />
        </div>
      </div>
    </div>
  </layout>
</template>
