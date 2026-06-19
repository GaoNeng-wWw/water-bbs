<script lang="ts" setup>
import { UiTag } from '@/components/ui';
import VoteProgress from './progress.vue';
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
  <div class="w-full">
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
      <vote-progress :yes="yes" :no="no" show-label />
    </div>
  </div>
</template>
