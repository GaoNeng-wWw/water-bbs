<script lang="ts" setup>
import { UiTree, type FlattenNode } from '@/components/ui';
import type { NestTreeNode } from '@/composables';
import { ref, watch } from 'vue';
const { tree } = defineProps<{
  tree: NestTreeNode[];
}>();
const emit = defineEmits<{
  expand: [string];
  clickCategory: [string];
}>();

const activeNode = ref<FlattenNode[]>([]);

watch(activeNode, () => {
  emit('clickCategory', activeNode.value[0].id);
}, { deep: true, flush: 'pre' });
</script>

<template>
  <div class="w-full text-warm-foreground">
    <ui-tree
      v-model="activeNode"
      :nodes="tree"
      @expand="(node) => $emit('expand', node.id)"
    />
  </div>
</template>
