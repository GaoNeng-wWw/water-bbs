<script lang="ts" setup>
import { computed } from 'vue';
import { buttonStyle } from './style';

const {
  ...themeProps
} = defineProps<{
  color?: 'surface' | 'primary' | 'danger' | undefined;
  variant?: 'solid' | 'outline' | 'ghost' | 'text' | undefined;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full' | undefined;
  icon?: boolean | undefined;
  disabled?: boolean | undefined;
  loading?: boolean | undefined;
}>();

const style = computed(() => buttonStyle(themeProps));
</script>

<template>
  <button :class="style">
    <slot v-if="$slots.prefix" />
    <slot />
    <slot v-if="$slots.suffix" />
  </button>
</template>
