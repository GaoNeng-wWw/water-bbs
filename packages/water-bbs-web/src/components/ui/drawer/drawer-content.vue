<script lang="ts" setup>
import { DrawerPortal, DrawerContent, DrawerOverlay, DrawerHandle } from 'vaul-vue';
import { useForwardPropsEmits, type DrawerContentEmits, type DrawerContentProps as DrawerContentProps_ } from 'reka-ui';

type DrawerContentProps = DrawerContentProps_ & {
  hiddenHandle: boolean;
};

const props = defineProps<DrawerContentProps>();
const emits = defineEmits<DrawerContentEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <drawer-portal>
    <drawer-overlay class="fixed inset-0 bg-black/40" />
    <drawer-content
      v-bind="forwarded"
      class="
      group fixed bottom-0 left-1/2 -translate-x-1/2 min-h-30 min-w-md
      bg-surface-100 p-4 rounded-t-xl
      border border-solid border-surface-200

      data-[vaul-drawer-direction='left']:translate-x-0
      data-[vaul-drawer-direction='left']:min-w-0
      data-[vaul-drawer-direction='left']:h-full
      data-[vaul-drawer-direction='left']:left-0
      data-[vaul-drawer-direction='left']:right-auto
      data-[vaul-drawer-direction='left']:w-md
      data-[vaul-drawer-direction='left']:z-100

      data-[vaul-drawer-direction='right']:translate-x-0
      data-[vaul-drawer-direction='right']:min-w-0
      data-[vaul-drawer-direction='right']:h-full
      data-[vaul-drawer-direction='right']:right-0
      data-[vaul-drawer-direction='right']:left-auto
      data-[vaul-drawer-direction='right']:w-md
      data-[vaul-drawer-direction='right']:z-100
      "
      :class="$attrs.class"
    >
      <drawer-handle v-if="!hiddenHandle" class="cursor-pointer block" />
      <slot />
    </drawer-content>
  </drawer-portal>
</template>
