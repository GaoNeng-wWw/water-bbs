<script lang="ts" setup>
import { DrawerContent, DrawerPortal, DrawerOverlay, DrawerHandle } from 'vaul-vue';
import { drawerContextKey, type Direction } from './context.prop';
import { tv } from 'tailwind-variants';
import { computed, inject, watch } from 'vue';

const { class: clazz, to, direction } = defineProps<{
  // eslint-disable-next-line vue/no-reserved-props
  class?: string;
  to?: string;
  direction?: Direction;
}>();

const styles = tv({
  slots: {
    overlay: 'size-full fixed inset-0 z-20 bg-black/40',
    content: 'fixed z-30 bg-warm-50 max-h-95dvh overflow-hidden border border-solid border-warm-200 rounded-t-lg p-4',
    handle: 'cursor-pointer shrink-0',
  },
  variants: {
    direction: {
      bottom: {
        content: 'bottom-0 left-1/2 -translate-x-1/2 h-full',
      },
      top: {
        content: 'top-0 left-1/2 -translate-x-1/2 h-full',
      },
      left: {
        content: 'left-0 top-1/2 bottom-1/2 -translate-y-1/2 h-full mr-2 [--initial-transform:calc(100%_+_8px)] rounded-b-lg',
        handle: 'rotate-90',
      },
      right: {
        content: 'right-0 top-1/2 bottom-1/2 -translate-y-1/2 h-full mr-2 [--initial-transform:calc(100%_+_8px)] rounded-b-lg',
        handle: 'rotate-90',
      },
    },
  },
});

const ctx = inject(drawerContextKey)!;
const dir = computed(() => direction || ctx.direction.value);

const baseClazz = computed(() => {
  return styles({ direction: direction || ctx.direction.value });
});
</script>

<template>
  <drawer-portal :to="to">
    <drawer-overlay :class="baseClazz.overlay()" />
    <drawer-content :class="[baseClazz.content(), clazz]">
      <drawer-handle v-if="dir === 'bottom'" :class="[baseClazz.handle()]" />
      <div class="w-full h-full flex items-center">
        <drawer-handle v-if="dir === 'right'" :class="[baseClazz.handle()]" />
        <slot />
        <drawer-handle v-if="dir === 'left'" :class="[baseClazz.handle()]" />
      </div>
      <drawer-handle v-if="dir === 'top'" :class="[baseClazz.handle()]" />
    </drawer-content>
  </drawer-portal>
</template>
