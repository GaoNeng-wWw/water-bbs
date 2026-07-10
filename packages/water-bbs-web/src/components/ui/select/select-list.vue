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

const makeComponent = (root: Option): VNode[] => {
  if (isGroupLabel(root)) {
    const children = root.children.map(makeComponent);
    return [
      h(GroupLabel, null, root.label),
      h(SelectGroup, children),
    ];
  }
  return [
    h(
      SelectItem,
      { value: root.value, disabled: root.disabled },
      root.label,
    ),
  ];
};

const components = computed(() => options.map(opt => makeComponent(opt)[0]));
</script>

<template>
  <Select.Content class="w-full bg-warm-100 p-1 rounded-md border border-warm-200" align="center">
    <Select.ScrollUpButton />
    <Select.Viewport class="space-y-2">
      <Select.Group>
        <component :is="comp" v-for="comp, idx in components" :key="idx" />
      </Select.Group>
      <!-- eslint-disable-next-line vue/no-v-for-template-key -->
      <!-- <template v-for="item, idx in data" :key="idx">
        <Select.Item
          v-if="'value' in item"
          :value="item.value"
          :disabled="item.disabled"
          class="
          data-[disabled]:hover:bg-transparent data-[disabled]:cursor-not-allowed data-[disabled]:text-warm-500
          text-warm-foreground p-1 px-2 rounded-md outline-none cursor-pointer transition duration-fast ease-in-out
          hover:bg-warm-200
          data-[state='checked']:bg-warm-200
        "
        >
          <Select.ItemText>
            {{ item.label }}
          </Select.ItemText>
        </Select.Item>
      </template> -->
    </Select.Viewport>
    <Select.ScrollDownButton />
  </Select.Content>
</template>
