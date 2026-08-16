<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v';
import type { DialogContentEmits, DialogContentProps } from 'reka-ui';
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, useForwardPropsEmits, injectDialogRootContext } from 'reka-ui';
import { ref, watchEffect } from 'vue';

const props = defineProps<DialogContentProps>();
const emits = defineEmits<DialogContentEmits>();
const context = injectDialogRootContext()!;
const triggerElement = context.triggerElement;

const pos = ref({
  x: 0,
  y: 0,
});

const setPos = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();

  pos.value = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
};

const setPosHandler = (ev: Event) => {
  setPos(ev.target as HTMLElement);
};

watchEffect((cleanup) => {
  const el = triggerElement.value;

  if (!el) {
    return;
  }
  setPos(el);
  el.addEventListener('click', setPosHandler);
  cleanup(() => {
    el.removeEventListener('click', setPosHandler);
  });
});

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <dialog-portal>
    <dialog-overlay class="fixed inset-0 z-30 bg-black/20" />
    <animate-presence>
      <dialog-content v-bind="forwarded" as-child>
        <motion.div
          class="fixed top-0 left-0 max-w-lg w-full p-4 rounded-md bg-surface-200 z-[calc(infinity+1)] flex flex-col"
          :class="$attrs.class"
          :initial="{
            opacity: 0,
            scale: 0,
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            x: '-50%',
            y: '50%',
          }"
          :animate="{
            opacity: 1,
            scale: 1,
            left: '50%',
            top: '50%',
            x: '-50%',
            y: '-50%',
          }"
          :exit="{
            opacity: 0,
            scale: 0,
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            x: '-50%',
            y: '50%',
          }"
        >
          <slot />
          <dialog-close class="mr-0 ml-auto -order-1 cursor-pointer flex items-center justify-center">
            <div class="icon-[material-symbols--close] size-6 text-bg-fg" />
            <span class="sr-only">Close</span>
          </dialog-close>
        </motion.div>
      </dialog-content>
    </animate-presence>
  </dialog-portal>
</template>
