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
    >
      <slot />
    </popover-content>
  </popover-portal>
</template>
