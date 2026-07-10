<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { BaseDrop } from '../base-drop';
import { UiButton } from '../button';
import type { FlattenNode, NestedNode } from '../tree/tree.prop';
import Tree from '../tree/tree.vue';

const { data } = defineProps<{
  data: NestedNode[];
}>();

const emits = defineEmits<{
  expand: [FlattenNode];
}>();
const activeNodes = ref<FlattenNode[]>([]);
const nodeLabeles = computed(() => activeNodes.value.map(node => node.label));
const modelValue = defineModel<FlattenNode[] | null>();
watch(activeNodes, () => {
  modelValue.value = activeNodes.value;
}, { immediate: true });
</script>

<template>
  <base-drop>
    <template #trigger>
      <ui-button>
        {{ nodeLabeles[0] ? nodeLabeles[0] : 'Not Select' }}
      </ui-button>
    </template>
    <template #content>
      <tree v-model="activeNodes" :nodes="data" @expand="(node) => emits('expand', node)" />
    </template>
  </base-drop>
</template>
