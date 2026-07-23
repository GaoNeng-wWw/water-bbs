<script lang="ts" setup>
import { createFactIdFromString, isConditionNode, ROOT_ID, useConditionTree, type Id, createConditionIdFromString, type ConditionKind, NOT_PUBLIC_ENDPOINT, createConditionNode, createFactNode, type ConditionId, type FactId } from '@/composables';
import { computed, h, reactive, ref, watch, type VNode } from 'vue';
import FactNode from './fact-node.vue';
import ConditionNode from './condition/node.vue';
import { taskControllerGetFacts } from '@/api/sdk.gen.ts';
import type { FactInfo } from '@/api';

const tree = useConditionTree();
const modelValue = defineModel<Record<string, any>>();
const updateCondition = (id: string, kind: ConditionKind) => {
  const node = tree.findNode(createConditionIdFromString(id));
  if (!node || !isConditionNode(node)) {
    return;
  }
  tree.updateNode(createConditionIdFromString(id), { kind });
  modelValue.value = tree.toCondition(tree.findNode(ROOT_ID)!);
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
  tree.updateNode(id as FactId, { ...node });
  modelValue.value = tree.toCondition(tree.findNode(ROOT_ID)!);
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
  modelValue.value = tree.toCondition(tree.findNode(ROOT_ID)!);
};

const returnSchemas = reactive(new Map());
const factInfos = ref<FactInfo[]>([]);
const factLabels = computed(() => {
  return factInfos.value.map(f => f.name);
});
const factLoading = ref(true);

factInfos.value = await taskControllerGetFacts({
  client: NOT_PUBLIC_ENDPOINT,
})
  .then(resp => resp.data ?? [])
  .then((data) => {
    data.forEach((info) => {
      returnSchemas.set(info.name, info.returnType);
    });
    return data;
  })
  .finally(() => {
    factLoading.value = false;
  });
const onSelect = (type: 'condition' | 'fact', value: string, parentId: string) => {
  const node = type === 'condition' ? createConditionNode(value as ConditionKind) : createFactNode(value, 'Equal', '');
  tree.addNode(node, parentId as Id);
};
const onRemove = (id: string) => {
  tree.removeNode(id as Id);
};
const dfs = (nodeId: Id): VNode | null => {
  const node = tree.findNode(nodeId);
  if (!node) {
    return null;
  }
  if (node.type === 'fact') {
    return h(
      FactNode,
      { id: node.id, label: node.factName, returnType: returnSchemas.get(node.factName), setData, setOperator },
    );
  }
  const facts = tree.getChildren(node.id)
    .map(dfs)
    .filter(vnode => vnode !== null);
  return h(
    ConditionNode,
    {
      id: node.id,
      label: node.kind,
      updateCondition,
      facts: factLabels.value,
      onSelect,
      onRemove,
    },
    () => facts,
  );
};
const conditionTree = computed(() => {
  if (factLoading.value) {
    return null;
  }
  return dfs(tree.findNode(ROOT_ID)!.id);
});
</script>

<template>
  <div class="w-full">
    <component :is="conditionTree" v-bind="$attrs" />
  </div>
</template>
