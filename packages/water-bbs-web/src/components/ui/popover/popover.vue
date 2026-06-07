<script setup lang="ts">
import type { PopoverContentEmits, PopoverContentProps } from 'reka-ui';
import { PopoverContent, PopoverPortal, useForwardPropsEmits } from 'reka-ui';

const props = defineProps<PopoverContentProps>();
const emits = defineEmits<PopoverContentEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <popover-portal>
    <popover-content
      v-bind="{ ...forwarded, ...$attrs }"
      position-strategy="fixed"
      class="min-w-200px text-warm-foreground bg-warm-100 px-2 py-2 rounded border border-solid border-warm-200"
    >
      <slot />
    </popover-content>
  </popover-portal>
</template>
