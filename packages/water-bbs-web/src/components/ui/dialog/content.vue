<script setup lang="ts">
import type { DialogContentEmits, DialogContentProps } from 'reka-ui';
import { DialogContent, DialogOverlay, DialogPortal, useForwardPropsEmits } from 'reka-ui';

const props = defineProps<DialogContentProps>();
const emits = defineEmits<DialogContentEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <dialog-portal force-mount>
    <Transition
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      class="transition-all duration-500 ease-in-out">
      <dialog-overlay class="fixed inset-0 bg-black/50" />
    </Transition>
    <Transition
      enter-from-class="opacity-0 translate-y-5 blur"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-15 blur"
      class="transition-all duration-300 ease-in-out">
      <dialog-content
        v-bind="forwarded"
        class="fixed inset-0 p-4 rounded-md bg-warm-100 w-full h-fit left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 outline-none max-w-md max-h-95%"
      >
        <slot />
      </dialog-content>
    </Transition>
  </dialog-portal>
</template>
