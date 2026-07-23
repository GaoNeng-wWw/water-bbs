<script lang="ts" setup>
import { UiButton, UiBaseDrop, UiListBox, UiListBoxItem, UiListBoxGroup, UiListBoxGroupLabel } from '@/components/ui';
import { ROOT_ID } from '@/composables';
import { useToggle } from '@vueuse/core';
import type { AcceptableValue } from 'reka-ui';
import { computed, h, type VNode } from 'vue';

export type ListOptions = {
  label: string;
  children: ListOptions[];
} | {
  label: string;
  value: string;
};

const {
  id,
  options = [],
} = defineProps<{
  id: string;
  options?: ListOptions[];
}>();
const emits = defineEmits<{ select: [string]; remove: [string] }>();
const [visible, setVisible] = useToggle(false);
const onSelect = (value: AcceptableValue) => {
  setVisible(false);
  if (!value) {
    return;
  }
  emits('select', value.toString());
};
const onClickRemove = () => {
  emits('remove', id);
};

const toVNode = (opt: ListOptions): VNode => {
  if ('children' in opt) {
    return h(
      UiListBoxGroup,
      () => [
        h(
          UiListBoxGroupLabel,
          () => opt.label,
        ),
        ...opt.children.map(toVNode),
      ],
    );
  }
  return h(
    UiListBoxItem,
    { value: opt.value },
    () => opt.label,
  );
};

const listItem = computed(() => options.map(toVNode));
</script>

<template>
  <div class="w-fit space-y-4">
    <ui-button v-if="id !== ROOT_ID" icon size="sm" color="danger" @click="onClickRemove">
      <div class="i-material-symbols:delete-outline size-6" />
    </ui-button>
    <ui-base-drop :visible="visible">
      <template #trigger>
        <ui-button icon size="sm" @click.stop="() => setVisible(!visible)">
          <div class="i-material-symbols:add size-6" />
        </ui-button>
      </template>
      <template #content>
        <ui-list-box @update:model-value="onSelect">
          <component :is="node" v-for="(node, index) in listItem" :key="index" />
        </ui-list-box>
      </template>
    </ui-base-drop>
  </div>
</template>
