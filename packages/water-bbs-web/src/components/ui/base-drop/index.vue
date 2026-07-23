<script lang="ts" setup>
import { UiPopover, UiPopoverContent, UiPopoverTrigger } from '../popover';
import type { PopoverContentEmits } from 'reka-ui';
import { useForwardPropsEmits } from 'reka-ui';
import type { BaseDropProps } from './index.props';

const { align = 'start', ...props } = defineProps<BaseDropProps>();
const emits = defineEmits<PopoverContentEmits>();
const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <ui-popover :open="props.visible">
    <ui-popover-trigger as-child>
      <slot name="trigger" />
    </ui-popover-trigger>
    <ui-popover-content
      v-bind="{
        ...forwarded,
      }"
      class="fixed top-0 w-sm h-fit rounded border border-warm-200 bg-warm-100 text-warm-foreground py2 z-999999"
    >
      <slot name="content" />
    </ui-popover-content>
  </ui-popover>
</template>