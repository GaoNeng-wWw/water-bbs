<script lang="ts" setup>
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    color?: string;
    showColor?: boolean;
    name: string;
  }>(),
  {
    color: 'var(--color-surface-500)',
    showColor: false,
  },
);

const color = computed(() => props.color);
</script>

<template>
  <div class="w-full flex items-center gap-3">
    <div
      v-if="showColor"
      class="rounded-full size-component-sm bg-(--color) shrink-0"
      :style="{ '--color': color ?? 'var(--color-surface-500)' }"
    />
    {{ name }}
  </div>
</template>
