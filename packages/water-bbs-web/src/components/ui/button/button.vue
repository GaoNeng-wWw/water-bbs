<script lang="ts" setup>
import { motion, AnimatePresence } from 'motion-v';
import { tv } from 'tailwind-variants';
import { computed, ref } from 'vue';

const { loading = false, ...props } = defineProps<{
  color?: 'info' | 'primary';
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
  defaultVariants: {
    icon: false, full: false,
    size: 'md', color: 'info', shape: 'ghost', rounded: 'sm',
  },
  base: [
    'text-base transition disabled:cursor-not-allowed disabled:bg-opacity-80',
    'inline-flex gap-2 items-center w-fit min-w-11 min-h-8 justify-center cursor-pointer',
  ],
  variants: {
    size: {
      tiny: 'text-xs min-w-8 min-h-8 p-1 px-2',
      sm: 'min-w-8 min-h-8 p-1 text-sm',
      md: 'min-w-10 min-h-10 py-2 px-2 rounded-md cursor-pointer',
    },
    full: {
      true: 'min-w-unset w-full',
    },
    icon: {
      true: 'aspect-ratio-square p-0',
    },
    shape: {
      ghost: 'bg-opacity-0! border-none hover:bg-opacity-40!',
      solid: 'border bg-opacity-100 hover:bg-opacity-80',
    },
    color: {
      primary: 'bg-primary-500 text-primary-foreground border-none',
      info: 'bg-warm-200 border-warm-300 text-warm-foreground',
    },
    rounded: {
      sm: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
  },
});
const clazz = computed(() => style(props));
console.log(clazz.value);
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
