<script lang="ts" setup>
import { tv } from 'tailwind-variants';
import { computed } from 'vue';

const props = defineProps<TagProps>();

const style = tv({
  slots: {
    wrapper: 'min-w-[64px] inline-flex justify-center items-center rounded-full shrink-0 grow-0',
    text: 'leading-none whitespace-nowrap',
  },
  variants: {
    size: {
      sm: {
        wrapper: 'size-fit px-2 py-1.15',
        text: 'text-xs',
      },
      md: {
        wrapper: 'size-fit px-4 py-1',
        text: 'text-sm',
      },
      lg: {
        wrapper: 'size-fit px-5 py-0.75',
        text: 'text-lg',
      },
    },
    color: {
      success: {
        wrapper: 'bg-success-200/30',
        text: 'text-success-700',
      },
      error: {
        wrapper: 'bg-danger-200/20',
        text: 'text-danger-800',
      },
      warning: {
        wrapper: 'bg-warning-200/20',
        text: 'text-warning-800',
      },
      primary: {
        wrapper: 'bg-primary-200/30',
        text: 'text-primary-700',
      },
      default: {
        wrapper: 'bg-warm-200/30 border border-warm-200',
        text: 'text-warm-foreground',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'default',
  },
});

type TagThemeProps = {
  size?: 'sm' | 'md' | 'lg' | undefined;
  color?: 'default' | 'success' | 'error' | 'warning' | 'primary' | undefined;
};

type TagProps = TagThemeProps & {};

const clazz = computed(() => style(props));
</script>

<template>
  <div :class="clazz.wrapper()">
    <div :class="clazz.text()">
      <slot />
    </div>
  </div>
</template>
