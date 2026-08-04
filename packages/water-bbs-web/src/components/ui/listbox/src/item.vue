<script lang="ts" setup>
import { computed, inject } from 'vue';
import type { ListboxItemProps } from './item.props';
import { ListBoxContextKey } from './root.props';

const {
  id, value, danger = false,
} = defineProps<ListboxItemProps>();

const ctx = inject(ListBoxContextKey)!;

const isSelected = computed(() => ctx.selectedKey.value.includes(id));
const onClick = () => {
  ctx.onSelect(id, value);
};
</script>

<template>
  <div
    :data-danger="danger"
    :data-is-select="isSelected"
    class="
      w-full flex px-2 py-1 cursor-pointer rounded-md
      hover:bg-surface-200 data-[danger=false]:text-surface-fg
      data-[danger=true]:text-danger-500
      data-[is-select=true]:bg-surface-200
    "
    @click="onClick"
  >
    <slot :is-selected="isSelected" :value="value" :select="onClick" />
  </div>
</template>
