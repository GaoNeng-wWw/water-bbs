<script lang="ts" setup>
import { UiForm, UiFormItem, UiInput, UiButton, UiTreeSelect, type FlattenNode } from '@/components/ui';
import type { NestTreeNode } from '@/composables';
import { computed, reactive, ref } from 'vue';

export type CreateCategoryModel = {
  name: string;
  parent?: string;
};

const { categories = [] } = defineProps<{
  categories: NestTreeNode[];
}>();

const emits = defineEmits<{
  submit: [CreateCategoryModel];
  categoryExpand: [string];
}>();

const parent = ref<FlattenNode[]>([]);
const model = reactive({
  name: '',
  parent: computed(() => parent.value[0]?.id),
});
const onExpand = (id: string) => {
  emits('categoryExpand', id);
};
const onClickSubmit = () => {
  emits('submit', model);
};
</script>

<template>
  <div class="w-full space-y-4">
    <ui-form v-model="model">
      <ui-form-item label="Category Name" name="name">
        <ui-input v-model="model.name" />
      </ui-form-item>
      <ui-form-item label="Parent" name="parent">
        <ui-tree-select v-model="parent" :data="categories" @expand="(node) => onExpand(node.id)" />
      </ui-form-item>
    </ui-form>
    <ui-button color="primary" shape="solid" full size="sm" @click="onClickSubmit">
      Create Category
    </ui-button>
  </div>
</template>
