<script lang="ts" setup>
import { motion, LayoutGroup, AnimatePresence } from 'motion-v';
import { CollapseContextKey, type CollapseContext, type CollapseProps } from './collapse.props';
import { provideContext } from '@/utils';
import { computed, ref, type Ref } from 'vue';

const { according } = defineProps<CollapseProps>();

const currentActive: Ref<string[]> = ref([]);

provideContext(CollapseContextKey, {
  according: computed(() => according),
  currentActive: computed(() => currentActive.value),
  setActive: function (key: string): void {
    if (according) {
      currentActive.value = [key];
      return;
    }
    if (currentActive.value.includes(key)) {
      currentActive.value = currentActive.value.filter(v => v !== key);
    } else {
      currentActive.value.push(key);
    }
  },
} satisfies CollapseContext);
</script>

<template>
  <animate-presence>
    <motion.div class="w-full h-fit">
      <layout-group>
        <slot />
      </layout-group>
    </motion.div>
  </animate-presence>
</template>
