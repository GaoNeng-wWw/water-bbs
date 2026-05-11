<script lang="ts" setup>
import { motion, AnimatePresence } from 'motion-v';
import { ref } from 'vue';

const { color = 'info', loading = false, disabled = false, htmlType = 'button' } = defineProps<{
  color?: 'info' | 'primary';
  loading?: boolean;
  disabled?: boolean;
  htmlType?: 'button' | 'submit' | 'reset';
}>();

const showLoading = ref(loading);
</script>

<template>
  <animate-presence :initial="false">
    <motion.button
      :disabled="loading || disabled"
      :type="htmlType"
      layout
      :transition="{ type: 'spring' }"
      :data-color="color"
      class="
      group
      disabled:cursor-not-allowed disabled:bg-opacity-80 disabled:text-opacity-50

      flex gap-2 items-center
      min-w-11 w-fit min-h-8 py-2 px-4 rounded-md cursor-pointer border border-solid border-transparent
      data-[color='primary']:bg-primary-500
      data-[color='info']:bg-warm-200 data-[color='info']:border-warm-300
      text-base
      data-[color='info']:text-warm-foreground
      data-[color='primary']:text-primary-foreground
    "
    >
      <motion.div layout="position">
        <slot />
      </motion.div>
      <motion.div
        v-if="showLoading"
        layout
        class="shrink-0 grow i-line-md:loading-loop"
        :initial="{ opacity: 0, scale: 0 }"
        :animate="{ opacity: 1, scale: 1 }"
        :exit="{ opacity: 0, scale: 0 }"
      />
    </motion.button>
  </animate-presence>
</template>
