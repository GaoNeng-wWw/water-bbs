<script lang="ts" setup>
import type { Operator, WhenExpression, WhenNode } from '@/types/when';
import Predicate from './predicate.vue';
import { computed } from 'vue';
import Expression from './expression.vue';
import { useTaskConditionContext } from './context.ts';
import { evalCondition } from './evaluator.ts';

type Props = {
  node: WhenNode;
};

const props = defineProps<Props>();
const isPredicate = (node: WhenNode) => 'all' in node || 'any' in node || 'not' in node;
const isExpression = (node: WhenNode): node is WhenExpression => !isPredicate(node);
const kind = computed(() => isPredicate(props.node) ? Object.keys(props.node)[0] as 'all' | 'any' | 'not' : null);
const predicate = computed(() => {
  if (isPredicate(props.node) && kind.value) {
    if ('all' in props.node) {
      return props.node.all;
    }
    if ('any' in props.node) {
      return props.node.any;
    }
    if ('not' in props.node) {
      return props.node.not;
    }
  }
  return null;
});
const { variable } = useTaskConditionContext();
const expNode = computed(() => {
  return isExpression(props.node)
    ? {
      exp: props.node,
      done: evalCondition(props.node.field, props.node.operator, props.node.goal, variable.value),
    }
    : null;
});
</script>

<template>
  <div class="w-full condition-tree">
    <predicate v-if="isPredicate(props.node) && kind && predicate" :kind="kind" :expression="predicate" />
    <expression v-if="expNode" :desc="expNode.exp.desc" :done="expNode.done" />
  </div>
</template>
