<script lang="ts" setup>
import { DrawerPortal, DrawerContent, DrawerOverlay, DrawerHandle } from 'vaul-vue';
import { useForwardPropsEmits, type DrawerContentEmits, type DrawerContentProps } from 'reka-ui';

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
      fixed bottom-0 left-1/2 -translate-x-1/2
      min-h-30 min-w-md
      bg-surface-100 p-4 rounded-t-xl
      border border-solid border-surface-200
      "
      :class="$attrs.class"
    >
      <drawer-handle class="cursor-pointer" />
      <slot />
    </drawer-content>
  </drawer-portal>
</template>
