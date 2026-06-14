<script lang="ts" setup>
import { UiButton, UiTag } from '@/components/ui';
import { Progress } from 'reka-ui/namespaced';
import { computed } from 'vue';

const { id, title, yes, no, status, ...props } = defineProps<{
  id: string;
  title: string;
  yes: number;
  no: number;
  status: 'active' | 'passed' | 'rejected' | 'executed' | 'cancelled';
  createdAt: string;
  endAt: string;
}>();

const emits = defineEmits<{
  vote: ['yes' | 'no'];
}>();

const total = computed(() => yes + no);

const yesProgress = computed(() => total.value === 0 ? 0 : (yes / total.value));
const noProgress = computed(() => total.value === 0 ? 0 : (no / total.value));

const safeEndAt = computed(() => new Date(props.endAt).toTemporalInstant().toZonedDateTimeISO('Asia/Shanghai'));
const now = Temporal.Now.plainDateISO();
const days = computed(() => now.until(safeEndAt.value, { largestUnit: 'day' }).days);
const timeText = computed(() => {
  if (days.value === 0) {
    return 'Today';
  }
  const absDay = Math.abs(days.value);
  if (absDay > 2) {
    if (days.value < 0) {
      return `${absDay} Days Ago`;
    }
    return `${absDay} Days Left`;
  }
  if (days.value < 0) {
    return `${absDay} Day Ago`;
  }
  return `${absDay} Day Left`;
});
const statusText = computed(() => status[0].toUpperCase() + status.slice(1));
</script>

<template>
  <div class="w-full flex flex-col gap-3 bg-warm-100 p-2.5 rounded-md border border-warm-200">
    <div class="w-full flex items-center justify-between">
      <ui-tag color="warning">
        {{ statusText }}
      </ui-tag>
      <div class="flex h-full gap-4 items-baseline">
        <span class="text-xs text-danger-500/80 font-bold">
          {{ timeText }}
        </span>
      </div>
    </div>
    <div class="w-full">
      <h1 class="text-warm-foreground text-xl font-bold px-2">
        <router-link :to="`/proposal/${id}`" class="hover:text-primary-500">
          {{ title }}
        </router-link>
      </h1>
    </div>
    <div class="w-full px-2">
      <div class="w-full flex justify-between mb-2">
        <span class="text-sm text-success-500">Agree <strong>{{ yes }}</strong></span>
        <span class="text-sm text-warning-500">Reject <strong>{{ no }}</strong></span>
      </div>
      <Progress.Root class="w-full h-1.5 overflow-hidden bg-warm-200 rounded relative">
        <Progress.Indicator
          class="w-full h-full block bg-success-500 rounded-l absolute top-0 left-0 origin-l" :style="{
            transform: `scaleX(${!yesProgress && !noProgress ? 0 : 1 - noProgress})`,
          }"
        />
        <Progress.Indicator
          class="w-full h-full block bg-warning-500 rounded-r absolute top-0 right-0 origin-r"
          :style="{
            transform: `scaleX(${!yesProgress && !noProgress ? 0 : 1 - yesProgress})`,
          }"
        />
      </Progress.Root>
      <p class="text-xs text-warm-foreground/80 mt-4 text-center">
        {{ total }} Votes
      </p>
    </div>
    <div class="w-full grid cols-2 gap-4">
      <ui-button full color="success" size="md" shape="ghost">
        Agree
      </ui-button>
      <ui-button full color="warning" size="md" shape="ghost">
        Reject
      </ui-button>
    </div>
  </div>
</template>
