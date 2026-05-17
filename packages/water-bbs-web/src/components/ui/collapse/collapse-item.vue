<script lang="ts" setup>
import { getContext } from '@/utils';
import { motion, AnimatePresence } from 'motion-v';
import { CollapseContextKey, type CollapseItemProp } from './collapse.props';
import { computed, useSlots } from 'vue';
const { id, label } = defineProps<CollapseItemProp>();

const slots = defineSlots();

const ctx = getContext(CollapseContextKey);

const isActive = computed(() => ctx.currentActive.value.includes(id));
const onClick = () => ctx.setActive(id)
</script>

<template>
  <motion.div class="w-full py-1">
    <motion.div class="w-full" @click="onClick">
      <slot :label="label" :active="isActive" name="header">
        <div class="w-full px-2 py-1 flex justify-between items-center text-warm-foreground cursor-pointer">
          <span>{{ label }}</span>
          <div
            :data-active="isActive"
            class="size-4 i-material-symbols:arrow-forward-ios-rounded data-[active='true']:-rotate-90"
          />
        </div>
      </slot>
    </motion.div>
    <animate-presence>
      <motion.div
        v-show="isActive"
        class="overflow-hidden w-full"
        :initial="{ height: 0, opacity: 0 }"
        :animate="{ height: 'auto', opacity: 1 }"
        :exit="{ height: 0, opacity: 0 }"
      >
        <slot />
      </motion.div>
    </animate-presence>
  </motion.div>
</template>
