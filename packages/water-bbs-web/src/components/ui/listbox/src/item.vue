<script lang="ts" setup>
import { computed, inject } from 'vue';
import type { ListboxItemProps } from './item.props';
import { ListBoxContextKey } from './root.props';

const {
  id, value, danger = false, disabled = false,
} = defineProps<ListboxItemProps>();

const ctx = inject(ListBoxContextKey)!;

const isSelected = computed(() => ctx.selectedKey.value.includes(id));
const isDisabled = computed(() => disabled || ctx.disabledKey.value.includes(id));
const onClick = () => {
  if (isDisabled.value) {
    return;
  }
  ctx.onSelect(id, value);
};
</script>

<template>
  <div
    :data-danger="danger"
    :data-is-select="isSelected"
    :data-disabled="isDisabled"
    class="
      w-full flex px-2 py-1 cursor-pointer rounded-md
      hover:bg-surface-200 data-[danger=false]:text-surface-fg
      data-[danger=true]:text-danger-500
      data-[is-select=true]:bg-surface-200
      data-[disabled=true]:cursor-not-allowed
      data-[disabled=true]:text-surface-fg/50
      data-[disabled=true]:hover:bg-transparent
    "
    @click="onClick"
  >
    <slot :is-selected="isSelected" :value="value" :select="onClick" />
  </div>
</template>
