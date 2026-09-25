<script lang="ts" setup>
import { tv } from 'tailwind-variants';

const { text, color } = defineProps<{
  text: string;
  color: 'surface' | 'primary' | 'warning' | 'danger' | 'success';
}>();

const style = tv({
  base: 'w-fit px-2 py-1 rounded-full flex items-center text-xs font-medium',
  variants: {
    color: {
      surface: 'bg-surface-100 text-surface-fg',
      primary: 'bg-primary-100 text-primary-fg',
      warning: 'bg-warning-100 text-warning-fg',
      danger: 'bg-danger-100 text-danger-fg',
      success: 'bg-success-100 text-success-fg',
    },
  },
});
</script>

<template>
  <div :class="style({ color })">
    {{ text }}
  </div>
</template>
