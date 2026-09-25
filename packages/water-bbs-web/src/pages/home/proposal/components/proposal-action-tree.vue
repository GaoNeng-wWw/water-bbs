<script lang="ts">
export type BaseNode = {
  id: string;
};
export type ParamNode = BaseNode & { type: 'param'; name: string; value: string };
export type ActionNode = BaseNode & { type: 'action'; name: string; children?: ParamNode[] };
</script>

<script lang="ts" setup>
import { TreeItem, TreeRoot } from 'reka-ui';

const { nodes } = defineProps<{
  nodes: ActionNode[];
}>();
</script>

<template>
  <tree-root v-slot="{ flattenItems }" :items="nodes" :get-key="(node) => node.id">
    <tree-item
      v-for="node in flattenItems"
      :key="node._id"
      :node="node"
      v-bind="node.bind"
      class="w-full"
      :style="{ 'padding-left': `${node.level}rem` }"
      @click.stop
    >
      <div v-if="node.value.type === 'action'" class="w-full cursor-pointer py-1 px-2 rounded-md transition duration-fast ease-in-out hover:bg-surface-200">
        {{ node.value.name }}
      </div>
      <div v-else class="w-full grid grid-cols-2">
        <div>
          {{ node.value.name }}
        </div>
        <div>
          {{ (node.value as unknown as ParamNode).value }}
        </div>
      </div>
    </tree-item>
  </tree-root>
</template>
