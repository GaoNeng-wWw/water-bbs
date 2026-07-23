<script lang="ts" setup>
import { Select } from 'reka-ui/namespaced';
import type { Option } from './select.props';
import { computed, h, type VNode } from 'vue';
import GroupLabel from './group-label.vue';
import { SelectGroup } from 'reka-ui';
import SelectItem from './select-item.vue';

const { options = [] } = defineProps<{
  options: Option[];
}>();

const isGroupLabel = (option: Option) => 'children' in option;

const makeComponents = (root: Option): VNode[] => {
  const result: VNode[] = [];
  if (isGroupLabel(root)) {
    result.push(h(GroupLabel, () => root.label));
    const children = root.children.flatMap(makeComponents);
    result.push(h(SelectGroup, () => children));
  } else {
    result.push(
      h(
        SelectItem,
        { value: root.value, disabled: root.disabled },
        () => root.label,
      ),
    );
  }
  return result;
};

const allComponents = computed(() => options.flatMap(makeComponents));
</script>

<template>
  <Select.Content class="w-full bg-warm-100 p-1 rounded-md border border-warm-200" align="center">
    <Select.ScrollUpButton />
    <Select.Viewport class="space-y-2">
      <Select.Group class="space-y-2">
        <template v-for="(comp, idx) in allComponents" :key="idx">
          <component :is="comp" />
        </template>
      </Select.Group>
    </Select.Viewport>
    <Select.ScrollDownButton />
  </Select.Content>
</template>
