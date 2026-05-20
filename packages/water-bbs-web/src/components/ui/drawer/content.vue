<script lang="ts" setup>
import { DrawerContent, DrawerPortal, DrawerOverlay } from 'vaul-vue';

// eslint-disable-next-line vue/no-reserved-props
const { class: clazz, to } = defineProps<{ class?: string, to?: string}>();
</script>

<template>
  <drawer-portal :to="to">
    <drawer-overlay class="w-full h-full fixed inset-0 z-20 bg-black/40" />
    <drawer-content class="fixed z-30" :class="[clazz]">
      <slot />
    </drawer-content>
  </drawer-portal>
</template>
