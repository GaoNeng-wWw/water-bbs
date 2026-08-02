<script lang="ts" setup>
import { computed, provide, ref, type Ref } from 'vue';
import { ListBoxContextKey, type ListBoxRootProps, type RootEmits } from './root.props';

const {
  mode = 'single',
  defaultSelected = [],
  ...props
} = defineProps<ListBoxRootProps>();

const emits = defineEmits<RootEmits>();

const selected: Ref<string[]> = ref(defaultSelected);
const onSelect = (id: string, value: string) => {
  emits('select', { id, value });
  if (mode === 'none') {
    return;
  }
  const idx = selected.value.indexOf(id);
  if (idx !== -1) {
    selected.value.splice(idx, 1);
  }
  if (mode === 'multiple') {
    selected.value.push(id);
  }
  if (mode === 'single') {
    selected.value = [id];
  }
};

provide(ListBoxContextKey, {
  onSelect,
  selectedKey: computed(() => selected.value),
  disabledKey: computed(() => props.disabledKey ?? []),
});
</script>

<template>
  <div class="w-full space-y-2">
    <slot />
  </div>
</template>
