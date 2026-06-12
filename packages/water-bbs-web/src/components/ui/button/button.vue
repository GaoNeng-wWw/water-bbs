<script lang="ts" setup>
import { motion, AnimatePresence } from 'motion-v';
import { tv } from 'tailwind-variants';
import { computed, ref } from 'vue';

const { loading = false, ...props } = defineProps<{
  color?: 'info' | 'primary' | 'success' | 'warning';
  loading?: boolean;
  disabled?: boolean;
  htmlType?: 'button' | 'submit' | 'reset';
  shape?: 'solid' | 'ghost';
  size?: 'tiny' | 'sm' | 'md';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  full?: boolean;
  icon?: boolean;
  // eslint-disable-next-line vue/no-reserved-props
  class?: string;
}>();

const emits = defineEmits<{ click: [MouseEvent] }>();

const onClick = (ev: MouseEvent) => {
  emits('click', ev);
};

const showLoading = ref(loading);

const style = tv({
  base: 'inline-flex items-center justify-center transition duration-fast cursor-pointer',
  variants: {
    disabled: {
      true: 'cursor-not-allowed bg-opacity-50! text-opacity-50! pointer-events-none',
    },
    full: {
      true: 'w-full',
    },
    icon: {
      true: 'aspect-square',
    },
    size: {
      tiny: 'text-xs min-w-7.5 min-h-7.5 p-1 px-2 text-sm',
      sm: 'min-w-8 min-h-8 p-1 text-sm',
      md: 'min-w-10 min-h-9 py-1 px-3 rounded-md cursor-pointer text-base',
    },
    rounded: {
      sm: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
    shape: {
      ghost: 'bg-opacity-0! border-none hover:bg-opacity-40! border-none',
      solid: 'border bg-opacity-100 hover:bg-opacity-80',
      flat: '',
    },
    color: {
      primary: '',
      success: '',
      info: '',
      warning: '',
    },
  },
  compoundVariants: [
    {
      color: 'primary', shape: 'ghost',
      className: 'bg-primary-500/0 text-primary-500 hover:bg-primary-500/20',
    },
    {
      color: 'warning', shape: 'ghost',
      className: 'bg-warning-500/0 text-warning-500 hover:bg-warning-500/20',
    },
    {
      color: 'success', shape: 'ghost',
      className: 'bg-success-500/0 text-success-500 hover:bg-success-500/20',
    },
    {
      color: 'info', shape: 'ghost',
      className: 'bg-warm-500/0 text-warm-500 hover:bg-warm-500/20',
    },
    {
      color: 'warning', shape: 'solid',
      className: 'bg-warning-500 text-warning-foreground hover:bg-warning-400 border-none',
    },
    {
      color: 'primary', shape: 'solid',
      className: 'bg-primary-500 text-primary-foreground hover:bg-primary-400 border-none',
    },
    {
      color: 'success', shape: 'solid',
      className: 'bg-success-500 text-success-foreground hover:bg-success-400 border-none',
    },
    {
      color: 'info', shape: 'solid',
      className: 'bg-warm-500 text-warm-foreground hover:bg-warm-400 border-none',
    },
    {
      color: 'info', shape: 'flat',
      className: 'text-warm-foreground hover:bg-warm-100 border-none',
    },
    {
      color: 'primary', shape: 'flat',
      className: 'text-primary-foreground hover:bg-primary-100 border-none',
    },
    {
      color: 'success', shape: 'flat',
      className: 'text-success-foreground hover:bg-success-100 border-none',
    },
    {
      color: 'warning', shape: 'flat',
      className: 'text-warning-foreground hover:bg-warning-100 border-none',
    },
  ],
  defaultVariants: {
    size: 'md',
    color: 'info',
    shape: 'flat',
    rounded: 'sm',
  },
});
const clazz = computed(() => style(props));
</script>

<template>
  <motion.button
    :disabled="loading || disabled"
    :type="htmlType"
    layout
    :transition="{ type: 'spring' }"
    :class="[clazz, props.class]"
    :initial="false"
    @click="onClick"
  >
    <motion.div layout="position" :initial="false">
      <slot />
    </motion.div>
    <animate-presence :initial="false">
      <motion.div
        v-if="showLoading"
        layout
        class="shrink-0 grow i-line-md:loading-loop"
        :initial="{ opacity: 0, scale: 0 }"
        :animate="{ opacity: 1, scale: 1 }"
        :exit="{ opacity: 0, scale: 0 }"
      />
    </animate-presence>
  </motion.button>
</template>
