<script lang="ts" setup>
import { Checkbox } from 'reka-ui/namespaced';
import { tv } from 'tailwind-variants';
import { computed } from 'vue';
import { AnimatePresence, motion } from 'motion-v';

const { size = 'md', colors = 'default', label } = defineProps<{
  size?: 'sm' | 'md' | 'lg' | undefined;
  colors?: 'default' | undefined;
  label?: string;
}>();

const checkbox = tv({
  base: 'transition duration-fast outline-none',
  slots: {
    container: 'flex gap-2 items-center',
    root: 'border shrink-0 size-full cursor-pointer',
    indicator: 'size-full flex items-center justify-center',
    checkIcon: 'text-warm-foreground',
    label: 'flex gap-2 items-center',
  },
  variants: {
    size: {
      sm: {
        container: 'size-5 rounded-sm',
        root: 'rounded-sm',
        label: 'text-sm',
      },
      md: {
        container: 'size-6 rounded',
        root: 'rounded',
        label: 'text-sm',
      },
      lg: {
        container: 'size-7 rounded-lg',
        root: 'rounded-lg',
        label: 'text-md',
      },
    },
    colors: {
      default: {
        root: [
          'bg-warm-50', 'border-warm-200', 'hover:bg-warm-100',
          'data-[state=checked]:bg-warm-100',
        ],
        checkIcon: ['text-warm-foreground'],
        label: ['text-warm-foreground'],
      },
    },
  },
});

const clazz = computed(() => checkbox({ size, colors }));
const modelValue = defineModel<boolean>({ required: false, default: false });
</script>

<template>
  <label :class="clazz.label()">
    <div :class="[clazz.container(), clazz.base()]">
      <Checkbox.Root v-model="modelValue" :class="[clazz.base(), clazz.root()]">
        <Checkbox.Indicator :class="[clazz.indicator()]">
          <slot name="checkIcon">
            <animate-presence>
              <motion.div
                v-if="modelValue"
                class="i-material-symbols:check"
                :class="clazz.checkIcon()"
                :initial="{ scale: 0 }"
                :animate="{ scale: 1 }"
                :exit="{ scale: 0 }"
              />
            </animate-presence>
          </slot>
        </Checkbox.Indicator>
      </Checkbox.Root>
    </div>
    {{ label }}
  </label>
</template>
