<script lang="ts" setup>
import { Layout, UiButton } from '@/components/ui';
import { Condition, Period, PeriodUnit, RewardList } from '@/components/app/task';
import { reactive } from 'vue';
import { HomeHeader } from '@/components/app/shell';

const formData = reactive({
  taskName: '',
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
      <div class="w-full flex flex-col gap-4 px-4">
        <div class="w-md">
          <input v-model="formData.taskName" type="text" placeholder="Untitled Task" class="w-full text-3xl border-none outline-none text-warm-foreground">
        </div>
        <div>
          <h2 class="text-warm-foreground text-2xl mb-2">
            Condition
          </h2>
          <condition />
        </div>
        <div>
          <h2 class="text-warm-foreground text-2xl mb-2">
            Period
          </h2>
          <div class="px-10">
            <period v-model="formData.period" />
          </div>
        </div>
        <div>
          <h2 class="text-warm-foreground text-2xl mb-2">
            Rewards
          </h2>
          <div>
            <reward-list />
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
