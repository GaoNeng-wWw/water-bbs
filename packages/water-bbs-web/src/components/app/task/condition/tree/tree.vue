<script lang="ts" setup>
import { createFactIdFromString, isConditionNode, ROOT_ID, useConditionTree, type Id, createConditionIdFromString, type ConditionKind } from '@/composables';
import { computed, h, watch, type VNode } from 'vue';
import FactNode from './fact-node.vue';
import ConditionNode from './condition/node.vue';
import z from 'zod';

const tree = useConditionTree();
const modelValue = defineModel<Record<string, any>>();
const updateCondition = (id: string, kind: ConditionKind) => {
  const node = tree.findNode(createConditionIdFromString(id));
  if (!node || !isConditionNode(node)) {
    return;
  }
  tree.updateNode(createConditionIdFromString(id), { kind });
};
const setData = (id: string, value: any) => {
  const node = tree.findNode(createFactIdFromString(id));
  if (!node) {
    return;
  }
  if (node.type !== 'fact') {
    return;
  }
  node.value = value;
};
const setOperator = (id: string, operator: string) => {
  const node = tree.findNode(createFactIdFromString(id));
  if (!node) {
    return;
  }
  if (node.type !== 'fact') {
    return;
  }
  node.operator = operator;
};

const dfs = (nodeId: Id): VNode | null => {
  const node = tree.findNode(nodeId);
  if (!node) {
    return null;
  }
  if (node.type === 'fact') {
    return h(FactNode, { id: node.id, label: node.factName, returnType: z.boolean().toJSONSchema(), setData, setOperator });
  }
  const facts = tree.getChildren(node.id)
    .map(dfs)
    .filter(vnode => vnode !== null);
  return h(ConditionNode, { id: node.id, label: node.kind, updateCondition }, facts);
};
const conditionTree = computed(() => dfs(tree.findNode(ROOT_ID)!.id));
watch(tree.tree, () => {
  modelValue.value = tree.toCondition(tree.findNode(ROOT_ID)!);
}, { deep: true });
</script>

<template>
  <div class="w-full">
    <component :is="conditionTree" />
  </div>
</template>
