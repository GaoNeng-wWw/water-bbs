<script lang="ts" setup>
import { UiPopover, UiPopoverContent, UiPopoverTrigger } from '../popover';
</script>

<template>
  <ui-popover>
    <ui-popover-trigger>
      <slot name="trigger" />
    </ui-popover-trigger>
    <ui-popover-content
      align="start"
      align-flip
      class="fixed top-0 w-sm h-fit rounded border border-warm-200 bg-warm-100 text-warm-foreground py2 z-999999"
    >
      <slot name="content" />
    </ui-popover-content>
  </ui-popover>
</template>
