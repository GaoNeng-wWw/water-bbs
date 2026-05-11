<script lang="ts" setup>
import { motion, AnimatePresence } from 'motion-v';
import { computed, onMounted, provide, readonly, ref, type Ref } from 'vue';
import { CONTEXT_KEY, type TabItem } from './tab.context';

const active = defineModel<string>({ required: false, default: '' });

const items: Ref<TabItem[]> = ref([]);
const activeComponent = computed(() => {
  const item = items.value.filter(item => item.key === active.value)[0];
  if (!item) {
    return null;
  }
  return item.component?.[0];
});
const register = (item: TabItem) => {
  if (items.value.find(i => i.key === item.key)) {
    items.value = items.value.filter(i => i.key !== item.key);
  }
  items.value.push(item);
};
const setActive = (key: string) => {
  active.value = key;
};
const onClick = (key: string) => setActive(key);
onMounted(() => {
  if (!active.value) {
    active.value = items.value[0].key;
  }
});
provide(CONTEXT_KEY, {
  items: readonly(items),
  register,
  setActive,
});
</script>

<template>
  <div>
    <motion.div class="w-full py-2 h-fit">
      <ul class="list-none flex gap-4">
        <motion.li
          v-for="item of items"
          :key="item.key"
          layout
          class="px-2 py-1 text-warm-foreground relative cursor-pointer"
          @click="() => onClick(item.key)"
        >
          <motion.div v-if="item.key === active" layout-id="thumb" layout class="w-full h-full bg-warm-200 border border-solid border-warm-300 absolute inset-0 rounded-md" />
          <motion.span class="relative z-10">
            {{ item.label }}
          </motion.span>
        </motion.li>
      </ul>
    </motion.div>
    <div v-show="false">
      <slot />
    </div>
    <motion.div
      :key="active"
    >
      <animate-presence mode="wait">
        <component :is="activeComponent" :key="active" />
      </animate-presence>
    </motion.div>
  </div>
</template>
