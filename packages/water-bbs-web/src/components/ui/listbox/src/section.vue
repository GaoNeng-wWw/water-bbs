<script lang="ts" setup>
import type { ListBoxSectionProps } from './section.props';

const {
  label
} = defineProps<ListBoxSectionProps>();
</script>

<template>
  <div class="w-full">
    <span class="text-surface-600 text-sm">{{ label }}</span>
    <div class="w-full space-y-2">
      <slot />
    </div>
  </div>
</template>