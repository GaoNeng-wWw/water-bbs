<script lang="ts" setup>
import { Progress } from 'reka-ui/namespaced';
import { computed } from 'vue';

const { showLabel = false, ...props } = defineProps<{
  yes: number;
  no: number;
  showLabel?: boolean;
}>();

const total = computed(() => Math.max(0, props.yes + props.no));
const yesWidth = computed(() => {
  if (total.value === 0) {
    return 0;
  };
  return props.yes / total.value;
});
const noWidth = computed(() => {
  if (total.value === 0) {
    return 0;
  };
  return props.no / total.value;
});
</script>

<template>
  <div class="w-full">
    <div class="w-full flex justify-between mb-2">
      <span class="text-sm text-success-500">Agree <strong>{{ yes }}</strong></span>
      <span class="text-sm text-warning-500">Reject <strong>{{ no }}</strong></span>
    </div>
    <Progress.Root class="w-full h-1.5 overflow-hidden bg-warm-200 rounded relative">
      <Progress.Indicator
        class="w-full h-full block bg-success-500 rounded-l absolute top-0 left-0 origin-l" :style="{
          transform: `scaleX(${yesWidth})`,
        }"
      />
      <Progress.Indicator
        class="w-full h-full block bg-warning-500 rounded-r absolute top-0 right-0 origin-r"
        :style="{
          transform: `scaleX(${noWidth})`,
        }"
      />
    </Progress.Root>
    <p class="text-xs text-warm-foreground/80 mt-4 text-center">
      {{ total }} Votes
    </p>
  </div>
</template>
