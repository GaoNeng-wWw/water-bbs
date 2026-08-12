<script lang="ts" setup>
import type { CategoryInfo } from '@/api';
import { UiListbox, UiListboxItem } from '@/components/ui';
import CategoryItem from './category-item.vue';
import { ref, watch, type Ref } from 'vue';

const props = defineProps<{
  items: CategoryInfo[];
  showColor?: boolean;
}>();

const modelValue = defineModel<string>({ required: false });
const selected: Ref<string[]> = ref(modelValue.value ? [modelValue.value] : []);
watch(selected, () => {
  modelValue.value = selected.value[0];
});
</script>

<template>
  <ui-listbox v-model="selected">
    <ui-listbox-item
      v-for="item of props.items"
      :id="item.id"
      :key="item.id"
      :value="item.id"
    >
      <category-item :color="item.color" :name="item.name" :show-color="props.showColor" />
    </ui-listbox-item>
  </ui-listbox>
</template>
