<script lang="ts" setup>
import { motion, AnimatePresence } from 'motion-v';
import { tv } from 'tailwind-variants';
import type { FlattenNode, TreeProps } from './tree.prop';
import { useTree } from './composables/use-tree';
import { computed, watch } from 'vue';

const { nodes = [] } = defineProps<TreeProps>();

const emits = defineEmits<{
  expand: [FlattenNode];
}>();

const style = tv({
  base: 'w-full h-fit flex flex-col gap-0.5',
});

const modelValue = defineModel<FlattenNode[]>({ required: false, default: [] });
const { flattenLeveledNode, activeNodes, canShow, onClick, isLeaf, isExpanded, isActive, toggleActive } = useTree(
  {
    node: computed(() => ({ type: 'nested', nodes })),
    activeLimit: 1,
    defaultActive: modelValue.value.map(node => node.id),
    onExpand(node) {
      emits('expand', node);
    },
  },
);

watch(activeNodes, () => {
  modelValue.value = activeNodes.value;
});
</script>

<template>
  <motion.div :class="style()">
    <template v-for="node of flattenLeveledNode">
      <motion.div
        v-if="canShow(node.id)"
        :key="node.id"
        :data-leaf="isLeaf(node.id) === true ? true : undefined"
        class="w-full space-y-2"
      >
        <animate-presence>
          <motion.div
            v-if="canShow(node.id)"
            class="w-fit px-2 flex overflow-hidden"
            :initial="{ height: 0, opacity: 0, filter: 'blur(2px)' }"
            :animate="{ height: 'auto', opacity: 1, filter: 'blur(0px)' }"
            :exit="{ height: 0, opacity: 0, filter: 'blur(2px)' }"
          >
            <motion.div class="h-4 w-[calc(--level_*_16px)]" :style="{ '--level': node.level }" />
            <motion.div :data-active="isActive(node.id) ? true : undefined" class="w-fit flex items-center gap-1 transition duration-fast ease-in-out group">
              <motion.div v-if="!isLeaf(node.id)" class="w-fit hover:bg-warm-100 p-2 rounded cursor-pointer" @click="() => onClick(node.id)">
                <motion.div
                  :data-active="isExpanded(node.id)"
                  class="size-3 i-material-symbols:arrow-forward-ios-rounded data-[active='true']:rotate-90"
                />
              </motion.div>
              <motion.div v-else class="w-3" />
              <motion.div
                :data-leaf="isLeaf(node.id)"
                layout="position"
                class="w-fit hover:bg-warm-100 px-2 data-[leaf=true]:ml-4 py-1 rounded cursor-pointer group-data-[active=true]:bg-primary-200/50"
                @click="() => toggleActive(node.id)"
              >
                {{ node.label }}
              </motion.div>
            </motion.div>
          </motion.div>
        </animate-presence>
      </motion.div>
    </template>
  </motion.div>
</template>
