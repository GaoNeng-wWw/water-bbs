<script setup lang="ts">
import { motion, AnimatePresence, LayoutGroup } from 'motion-v';
import type { DialogContentEmits, DialogContentProps } from 'reka-ui';
import { DialogContent, DialogOverlay, DialogPortal, useForwardPropsEmits } from 'reka-ui';

const props = defineProps<DialogContentProps>();
const emits = defineEmits<DialogContentEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <dialog-portal force-mount>
    <dialog-overlay as-child>
      <motion.div class="fixed inset-0 bg-black/50" :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }" />
    </dialog-overlay>
    <animate-presence>
      <dialog-content
        v-bind="forwarded"
        as-child
      >
        <motion.div
          :initial="{ opacity: 0, filter: 'blur(20px)', y: 30, scale: 0.95 }"
          :animate="{ opacity: 1, filter: 'blur(0px)', y: 0, scale: 1 }"
          :exit="{ opacity: 0, filter: 'blur(20px)', y: 30, scale: 0.95 }"
          :transition="{ type: 'tween' }"
          class="
            fixed p-4 rounded-md bg-warm-100 w-full h-fit left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 outline-none max-w-md
            max-h-95%
          "
        >
          <slot />
        </motion.div>
      </dialog-content>
    </animate-presence>
  </dialog-portal>
</template>
