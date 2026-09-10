<script lang="ts" setup>
import { ProgressRoot, ProgressIndicator } from 'reka-ui';

const props = defineProps<{
  agree: number;
  disagree: number;
}>();
</script>

<template>
  <div>
    <progress-root
      class="rounded-full relative h-2 w-full overflow-hidden bg-surface-50 border border-surface-200"
    >
      <progress-indicator
        :agreen="agree"
        :disagreen="disagree"
        class="indicator"
        style="transform: translateX(0%)"
      />
    </progress-root>
    <slot name="meta">
      <div class="w-full grid grid-cols-2 mt-2">
        <div class="text-center text-sm">
          {{ agree }}%
        </div>
        <div class="text-center text-sm">
          {{ disagree }}%
        </div>
      </div>
    </slot>
  </div>
</template>

<style scoped>
@reference 'tailwindcss';
@reference "../../../../assets/style.css";

.indicator {
  @apply rounded-full block absolute left-0 top-0 w-full h-full bg-success-500 transition-transform overflow-hidden duration-660;
  background: linear-gradient(
    to right,
    var(--color-success-500) calc(1% * attr(agreen type(<number>))),
    var(--color-danger-500) calc(1% * attr(disagreen type(<number>)))
    );
}
</style>
